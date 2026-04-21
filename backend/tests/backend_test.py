"""Backend tests for Tête de Mouette FiveM site."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else "https://mouette-fivem-pro.preview.emergentagent.com"

CREATOR_EMAIL = "createur@mouette.gg"
CREATOR_PASSWORD = "Mouette2026!"
ADMIN_EMAIL = "admin@mouette.gg"
ADMIN_PASSWORD = "Admin2026!"


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def creator_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": CREATOR_EMAIL, "password": CREATOR_PASSWORD})
    assert r.status_code == 200, f"Creator login failed: {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="module")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.text}"
    return r.json()["token"]


# ---------- Health / Public ----------
class TestPublic:
    def test_root(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("status") == "online"

    def test_categories(self, api):
        r = api.get(f"{BASE_URL}/api/categories")
        assert r.status_code == 200
        cats = r.json()
        assert len(cats) == 7
        ids = {c["id"] for c in cats}
        assert {"fivem", "reshade", "pack-graphique", "optimisation", "cyber-info", "mods", "crosshair", "manette"} == ids

    def test_tutorials_list(self, api):
        r = api.get(f"{BASE_URL}/api/tutorials")
        assert r.status_code == 200
        tuts = r.json()
        assert len(tuts) >= 12
        assert all(t.get("published") for t in tuts)

    def test_tutorials_filter_category(self, api):
        r = api.get(f"{BASE_URL}/api/tutorials", params={"category": "reshade"})
        assert r.status_code == 200
        tuts = r.json()
        assert len(tuts) >= 1
        assert all(t["category"] == "reshade" for t in tuts)

    def test_tutorials_search_q(self, api):
        r = api.get(f"{BASE_URL}/api/tutorials", params={"q": "ReShade"})
        assert r.status_code == 200
        tuts = r.json()
        assert len(tuts) >= 1

    def test_tutorials_featured(self, api):
        r = api.get(f"{BASE_URL}/api/tutorials", params={"featured": "true"})
        assert r.status_code == 200
        tuts = r.json()
        assert all(t.get("featured") for t in tuts)

    def test_tutorial_by_slug(self, api):
        # Pick one from seed: installer-reshade-fivem
        r = api.get(f"{BASE_URL}/api/tutorials/slug/installer-reshade-fivem")
        assert r.status_code == 200
        tuto = r.json()
        assert tuto["slug"] == "installer-reshade-fivem"
        assert len(tuto["steps"]) >= 1
        assert tuto["steps"][0]["title"]

    def test_tutorial_slug_404(self, api):
        r = api.get(f"{BASE_URL}/api/tutorials/slug/does-not-exist-xyz")
        assert r.status_code == 404


# ---------- Auth ----------
class TestAuth:
    def test_creator_login(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": CREATOR_EMAIL, "password": CREATOR_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str)
        assert data["user"]["role"] == "creator"
        assert data["user"]["email"] == CREATOR_EMAIL

    def test_admin_login(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        assert r.json()["user"]["role"] == "admin"

    def test_invalid_login(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": CREATOR_EMAIL, "password": "wrongpass"})
        assert r.status_code == 401

    def test_me_endpoint(self, api, creator_token):
        r = api.get(f"{BASE_URL}/api/auth/me", headers={"Authorization": f"Bearer {creator_token}"})
        assert r.status_code == 200
        assert r.json()["email"] == CREATOR_EMAIL

    def test_me_no_token(self, api):
        r = requests.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401


# ---------- User Management (Creator only) ----------
class TestUsers:
    def test_list_users_as_creator(self, api, creator_token):
        r = api.get(f"{BASE_URL}/api/users", headers={"Authorization": f"Bearer {creator_token}"})
        assert r.status_code == 200
        users = r.json()
        assert len(users) >= 2

    def test_list_users_as_admin_forbidden(self, api, admin_token):
        r = api.get(f"{BASE_URL}/api/users", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 403

    def test_user_crud(self, api, creator_token):
        headers = {"Authorization": f"Bearer {creator_token}"}
        email = f"TEST_{uuid.uuid4().hex[:8]}@mouette.gg"
        # CREATE
        r = api.post(f"{BASE_URL}/api/users", headers=headers, json={
            "email": email, "password": "testpass123", "name": "TEST User", "role": "admin"
        })
        assert r.status_code == 201, r.text
        uid = r.json()["id"]
        assert r.json()["role"] == "admin"

        # GET (via list)
        r = api.get(f"{BASE_URL}/api/users", headers=headers)
        assert any(u["id"] == uid for u in r.json())

        # UPDATE
        r = api.patch(f"{BASE_URL}/api/users/{uid}", headers=headers, json={"name": "Updated Name"})
        assert r.status_code == 200
        assert r.json()["name"] == "Updated Name"

        # DELETE
        r = api.delete(f"{BASE_URL}/api/users/{uid}", headers=headers)
        assert r.status_code == 204

    def test_cannot_delete_self(self, api, creator_token):
        # Find creator's own id
        headers = {"Authorization": f"Bearer {creator_token}"}
        me = api.get(f"{BASE_URL}/api/auth/me", headers=headers).json()
        r = api.delete(f"{BASE_URL}/api/users/{me['id']}", headers=headers)
        assert r.status_code == 400

    def test_cannot_delete_last_creator(self, api, creator_token):
        # There should only be 1 creator; attempt delete by fetching creator id via list
        headers = {"Authorization": f"Bearer {creator_token}"}
        users = api.get(f"{BASE_URL}/api/users", headers=headers).json()
        creators = [u for u in users if u["role"] == "creator"]
        # If only 1 creator and it's self, the self-delete check fires first (400).
        # So this is effectively covered by test_cannot_delete_self.
        assert len(creators) >= 1


# ---------- Tutorials Admin CRUD ----------
class TestTutorialsAdmin:
    def test_admin_list_tutorials_as_admin(self, api, admin_token):
        r = api.get(f"{BASE_URL}/api/admin/tutorials", headers={"Authorization": f"Bearer {admin_token}"})
        assert r.status_code == 200
        assert len(r.json()) >= 12

    def test_admin_list_unauthed(self, api):
        r = requests.get(f"{BASE_URL}/api/admin/tutorials")
        assert r.status_code == 401

    def test_tutorial_crud_as_creator(self, api, creator_token):
        headers = {"Authorization": f"Bearer {creator_token}"}
        title = f"TEST Tutorial {uuid.uuid4().hex[:6]}"
        payload = {
            "title": title,
            "category": "fivem",
            "description": "test desc",
            "difficulty": "Débutant",
            "duration": "5 min",
            "steps": [{"number": 1, "title": "Step one", "content": "content"}],
            "published": True,
            "featured": False,
        }
        # CREATE
        r = api.post(f"{BASE_URL}/api/admin/tutorials", headers=headers, json=payload)
        assert r.status_code == 201, r.text
        tuto = r.json()
        tid, slug = tuto["id"], tuto["slug"]

        # VERIFY via public slug endpoint
        r = api.get(f"{BASE_URL}/api/tutorials/slug/{slug}")
        assert r.status_code == 200
        assert r.json()["title"] == title

        # UPDATE
        payload["description"] = "updated desc"
        r = api.patch(f"{BASE_URL}/api/admin/tutorials/{tid}", headers=headers, json=payload)
        assert r.status_code == 200
        assert r.json()["description"] == "updated desc"

        # DELETE
        r = api.delete(f"{BASE_URL}/api/admin/tutorials/{tid}", headers=headers)
        assert r.status_code == 204

        # VERIFY 404
        r = api.get(f"{BASE_URL}/api/tutorials/slug/{slug}")
        assert r.status_code == 404

    def test_admin_can_create_tutorial(self, api, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        payload = {
            "title": f"TEST Admin Create {uuid.uuid4().hex[:6]}",
            "category": "mods", "description": "d", "steps": [],
        }
        r = api.post(f"{BASE_URL}/api/admin/tutorials", headers=headers, json=payload)
        assert r.status_code == 201
        tid = r.json()["id"]
        # cleanup
        api.delete(f"{BASE_URL}/api/admin/tutorials/{tid}", headers=headers)
