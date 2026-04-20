from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import re
import uuid
import bcrypt
import jwt
import requests
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, UploadFile, File
from fastapi.security import HTTPBearer
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

from seed_data import SEED_TUTORIALS

# ---------- Config ----------
MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# ---------- Object storage ----------
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
APP_NAME = os.environ.get("APP_NAME", "mouette")
MIME_TYPES = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "webp": "image/webp",
}
_storage_key = None


def init_storage():
    global _storage_key
    if _storage_key:
        return _storage_key
    if not EMERGENT_KEY:
        raise RuntimeError("EMERGENT_LLM_KEY missing")
    resp = requests.post(
        f"{STORAGE_URL}/init",
        json={"emergent_key": EMERGENT_KEY},
        timeout=30,
    )
    resp.raise_for_status()
    _storage_key = resp.json()["storage_key"]
    return _storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Tête de Mouette API")
api_router = APIRouter(prefix="/api")

# ---------- Logging ----------
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ---------- Utils ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")

bearer_scheme = HTTPBearer(auto_error=False)

async def get_current_user(request: Request) -> dict:
    token = None
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
    if not token:
        token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token invalide")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") not in ("admin", "creator"):
        raise HTTPException(status_code=403, detail="Accès admin requis")
    return user

async def require_creator(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "creator":
        raise HTTPException(status_code=403, detail="Accès Créateur requis")
    return user

# ---------- Models ----------
class LoginIn(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    created_at: str

class UserCreateIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1)
    role: str = Field(pattern="^(admin|creator)$")

class UserUpdateIn(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = Field(default=None, min_length=6)
    role: Optional[str] = Field(default=None, pattern="^(admin|creator)$")

class Step(BaseModel):
    number: int
    title: str
    content: str = ""
    code: Optional[str] = None
    warning: Optional[str] = None
    tip: Optional[str] = None
    link: Optional[str] = None

class TutorialIn(BaseModel):
    title: str
    slug: Optional[str] = None
    category: str
    description: str
    thumbnail: Optional[str] = None
    difficulty: str = "Débutant"
    duration: str = "10 min"
    steps: List[Step] = []
    published: bool = True
    featured: bool = False

class TutorialOut(TutorialIn):
    id: str
    slug: str
    created_at: str
    updated_at: str

# ---------- Auth Endpoints ----------
@api_router.post("/auth/login")
async def login(body: LoginIn):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    token = create_access_token(user["id"], user["email"], user["role"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "created_at": user["created_at"],
        },
    }

@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return user

# ---------- User Management (Créateur only) ----------
@api_router.get("/users", response_model=List[UserOut])
async def list_users(_: dict = Depends(require_creator)):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", 1).to_list(1000)
    return users

@api_router.post("/users", response_model=UserOut, status_code=201)
async def create_user(body: UserCreateIn, _: dict = Depends(require_creator)):
    email = body.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    now = datetime.now(timezone.utc).isoformat()
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "name": body.name,
        "role": body.role,
        "password_hash": hash_password(body.password),
        "created_at": now,
    }
    await db.users.insert_one(user_doc)
    user_doc.pop("password_hash", None)
    user_doc.pop("_id", None)
    return user_doc

@api_router.patch("/users/{user_id}", response_model=UserOut)
async def update_user(user_id: str, body: UserUpdateIn, current: dict = Depends(require_creator)):
    target = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not target:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    updates = {}
    if body.name is not None:
        updates["name"] = body.name
    if body.password:
        updates["password_hash"] = hash_password(body.password)
    if body.role is not None:
        if target["role"] == "creator" and body.role != "creator":
            # prevent downgrading the last creator
            count = await db.users.count_documents({"role": "creator"})
            if count <= 1:
                raise HTTPException(status_code=400, detail="Impossible de rétrograder le dernier Créateur")
        updates["role"] = body.role
    if updates:
        await db.users.update_one({"id": user_id}, {"$set": updates})
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    return user

@api_router.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: str, current: dict = Depends(require_creator)):
    if user_id == current["id"]:
        raise HTTPException(status_code=400, detail="Vous ne pouvez pas supprimer votre propre compte")
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    if target["role"] == "creator":
        count = await db.users.count_documents({"role": "creator"})
        if count <= 1:
            raise HTTPException(status_code=400, detail="Impossible de supprimer le dernier Créateur")
    await db.users.delete_one({"id": user_id})
    return Response(status_code=204)

# ---------- Tutorials (Public) ----------
@api_router.get("/tutorials", response_model=List[TutorialOut])
async def list_tutorials(category: Optional[str] = None, q: Optional[str] = None, featured: Optional[bool] = None):
    query = {"published": True}
    if category and category != "all":
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
        ]
    tutorials = await db.tutorials.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return tutorials

@api_router.get("/tutorials/slug/{slug}", response_model=TutorialOut)
async def get_tutorial_by_slug(slug: str):
    tutorial = await db.tutorials.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutoriel introuvable")
    return tutorial

@api_router.get("/categories")
async def list_categories():
    return [
        {"id": "fivem", "name": "FiveM", "icon": "Gamepad2"},
        {"id": "reshade", "name": "ReShade", "icon": "Wand2"},
        {"id": "pack-graphique", "name": "Pack Graphique", "icon": "Image"},
        {"id": "optimisation", "name": "Optimisation PC", "icon": "Cpu"},
        {"id": "mods", "name": "Mods", "icon": "Wrench"},
        {"id": "crosshair", "name": "Crosshair", "icon": "Crosshair"},
        {"id": "manette", "name": "Manette & Clavier", "icon": "Gamepad"},
    ]

# ---------- Tutorials (Admin) ----------
@api_router.get("/admin/tutorials", response_model=List[TutorialOut])
async def admin_list_tutorials(_: dict = Depends(require_admin)):
    tutorials = await db.tutorials.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return tutorials

@api_router.post("/admin/tutorials", response_model=TutorialOut, status_code=201)
async def admin_create_tutorial(body: TutorialIn, _: dict = Depends(require_admin)):
    slug = body.slug or slugify(body.title)
    if await db.tutorials.find_one({"slug": slug}):
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"
    now = datetime.now(timezone.utc).isoformat()
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["slug"] = slug
    doc["created_at"] = now
    doc["updated_at"] = now
    await db.tutorials.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.patch("/admin/tutorials/{tutorial_id}", response_model=TutorialOut)
async def admin_update_tutorial(tutorial_id: str, body: TutorialIn, _: dict = Depends(require_admin)):
    existing = await db.tutorials.find_one({"id": tutorial_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Tutoriel introuvable")
    data = body.model_dump()
    data["slug"] = data.get("slug") or existing["slug"]
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.tutorials.update_one({"id": tutorial_id}, {"$set": data})
    updated = await db.tutorials.find_one({"id": tutorial_id}, {"_id": 0})
    return updated

@api_router.delete("/admin/tutorials/{tutorial_id}", status_code=204)
async def admin_delete_tutorial(tutorial_id: str, _: dict = Depends(require_admin)):
    result = await db.tutorials.delete_one({"id": tutorial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tutoriel introuvable")
    return Response(status_code=204)

# ---------- Health ----------
@api_router.get("/")
async def root():
    return {"app": "Tête de Mouette", "status": "online"}


# ---------- Uploads (Admin) ----------
@api_router.post("/admin/uploads")
async def upload_image(file: UploadFile = File(...), _: dict = Depends(require_admin)):
    ext = (file.filename or "").split(".")[-1].lower() if file.filename and "." in file.filename else "bin"
    if ext not in MIME_TYPES:
        raise HTTPException(status_code=400, detail="Format non supporté (jpg, png, webp, gif)")
    content_type = MIME_TYPES[ext]
    data = await file.read()
    if len(data) > 3 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Fichier trop lourd (max 3 Mo)")
    path = f"{APP_NAME}/thumbnails/{uuid.uuid4()}.{ext}"
    try:
        result = put_object(path, data, content_type)
    except Exception as exc:
        logger.exception("Upload failed")
        raise HTTPException(status_code=500, detail=f"Upload échoué: {exc}")
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "content_type": content_type,
        "size": result.get("size", len(data)),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"path": result["path"], "url": f"/api/files/{result['path']}"}


# Public — serves tutorial thumbnails without auth
@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    try:
        data, content_type = get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="Fichier introuvable")
    return Response(content=data, media_type=content_type, headers={"Cache-Control": "public, max-age=3600"})


# ---------- Comments ----------
class CommentIn(BaseModel):
    tutorial_slug: str = Field(min_length=1)
    author: str = Field(min_length=1, max_length=60)
    content: str = Field(min_length=2, max_length=1200)


class CommentOut(BaseModel):
    id: str
    tutorial_slug: str
    author: str
    content: str
    status: str
    created_at: str


@api_router.post("/comments", response_model=CommentOut, status_code=201)
async def create_comment(body: CommentIn):
    tutorial = await db.tutorials.find_one({"slug": body.tutorial_slug}, {"_id": 0, "id": 1})
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutoriel introuvable")
    doc = {
        "id": str(uuid.uuid4()),
        "tutorial_slug": body.tutorial_slug,
        "author": body.author.strip(),
        "content": body.content.strip(),
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.comments.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.get("/comments/tutorial/{slug}", response_model=List[CommentOut])
async def list_comments_public(slug: str):
    comments = await db.comments.find(
        {"tutorial_slug": slug, "status": "approved"},
        {"_id": 0},
    ).sort("created_at", -1).to_list(500)
    return comments


@api_router.get("/admin/comments", response_model=List[CommentOut])
async def admin_list_comments(status_filter: Optional[str] = None, _: dict = Depends(require_admin)):
    query = {}
    if status_filter in ("pending", "approved", "rejected"):
        query["status"] = status_filter
    comments = await db.comments.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return comments


class CommentModerateIn(BaseModel):
    status: str = Field(pattern="^(pending|approved|rejected)$")


@api_router.patch("/admin/comments/{comment_id}", response_model=CommentOut)
async def admin_moderate_comment(comment_id: str, body: CommentModerateIn, _: dict = Depends(require_admin)):
    comment = await db.comments.find_one({"id": comment_id}, {"_id": 0})
    if not comment:
        raise HTTPException(status_code=404, detail="Commentaire introuvable")
    await db.comments.update_one({"id": comment_id}, {"$set": {"status": body.status}})
    comment["status"] = body.status
    return comment


@api_router.delete("/admin/comments/{comment_id}", status_code=204)
async def admin_delete_comment(comment_id: str, _: dict = Depends(require_admin)):
    result = await db.comments.delete_one({"id": comment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Commentaire introuvable")
    return Response(status_code=204)


# ---------- Seed ----------
async def seed_users():
    creator_email = os.environ["CREATOR_EMAIL"].lower().strip()
    creator_password = os.environ["CREATOR_PASSWORD"]
    admin_email = os.environ["ADMIN_EMAIL"].lower().strip()
    admin_password = os.environ["ADMIN_PASSWORD"]
    now = datetime.now(timezone.utc).isoformat()

    # Creator
    existing = await db.users.find_one({"email": creator_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": creator_email,
            "name": "Tête de Mouette",
            "role": "creator",
            "password_hash": hash_password(creator_password),
            "created_at": now,
        })
        logger.info(f"Seeded creator: {creator_email}")
    elif not verify_password(creator_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": creator_email},
            {"$set": {"password_hash": hash_password(creator_password), "role": "creator"}},
        )

    # Admin
    existing_admin = await db.users.find_one({"email": admin_email})
    if not existing_admin:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "name": "Admin",
            "role": "admin",
            "password_hash": hash_password(admin_password),
            "created_at": now,
        })
        logger.info(f"Seeded admin: {admin_email}")

async def seed_tutorials():
    count = await db.tutorials.count_documents({})
    if count > 0:
        return
    now = datetime.now(timezone.utc).isoformat()
    for tuto in SEED_TUTORIALS:
        doc = dict(tuto)
        doc["id"] = str(uuid.uuid4())
        doc["created_at"] = now
        doc["updated_at"] = now
        await db.tutorials.insert_one(doc)
    logger.info(f"Seeded {len(SEED_TUTORIALS)} tutorials")

@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.tutorials.create_index("slug", unique=True)
    await db.tutorials.create_index("id", unique=True)
    await db.comments.create_index("tutorial_slug")
    await db.comments.create_index("status")
    try:
        init_storage()
        logger.info("Emergent storage initialized")
    except Exception as exc:
        logger.warning(f"Storage init skipped: {exc}")
    await seed_users()
    await seed_tutorials()

@app.on_event("shutdown")
async def on_shutdown():
    client.close()

# ---------- Middleware ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
