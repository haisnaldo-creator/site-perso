"""Tests for the new Comments + Uploads endpoints (iteration 2)."""
import io
import os
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else "https://mouette-fivem-pro.preview.emergentagent.com"

CREATOR_EMAIL = "createur@mouette.gg"
CREATOR_PASSWORD = "Mouette2026!"
ADMIN_EMAIL = "admin@mouette.gg"
ADMIN_PASSWORD = "Admin2026!"

SAMPLE_SLUG = "changer-luminosite-reshade"

# Minimal 1x1 PNG (67 bytes)
PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\xcf"
    b"\xc0\x00\x00\x00\x03\x00\x01\xde\xdf\x9f\x87\x00\x00\x00\x00IEND\xaeB`\x82"
)


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    return s


@pytest.fixture(scope="module")
def creator_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login",
                 json={"email": CREATOR_EMAIL, "password": CREATOR_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login",
                 json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


# ==================== PUBLIC COMMENTS ====================
class TestPublicComments:
    """Public comment submission + read"""

    def test_create_comment_valid_slug(self, api):
        payload = {
            "tutorial_slug": SAMPLE_SLUG,
            "author": "TEST_Joueur",
            "content": f"TEST comment {uuid.uuid4().hex[:6]}",
        }
        r = api.post(f"{BASE_URL}/api/comments", json=payload)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["status"] == "pending"
        assert data["tutorial_slug"] == SAMPLE_SLUG
        assert data["author"] == "TEST_Joueur"
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data

    def test_create_comment_invalid_slug(self, api):
        r = api.post(f"{BASE_URL}/api/comments", json={
            "tutorial_slug": "does-not-exist-xyz",
            "author": "Tester",
            "content": "hello",
        })
        assert r.status_code == 404

    def test_create_comment_validation_short_content(self, api):
        r = api.post(f"{BASE_URL}/api/comments", json={
            "tutorial_slug": SAMPLE_SLUG,
            "author": "A",
            "content": "x",  # < 2 chars
        })
        assert r.status_code == 422

    def test_list_public_only_approved(self, api, admin_token):
        # Seed a pending + an approved comment
        headers = {"Authorization": f"Bearer {admin_token}"}
        content_token = f"APPROVED_{uuid.uuid4().hex[:8]}"
        r = api.post(f"{BASE_URL}/api/comments", json={
            "tutorial_slug": SAMPLE_SLUG,
            "author": "TEST_Approver",
            "content": content_token,
        })
        assert r.status_code == 201
        cid = r.json()["id"]
        # Approve it
        r = api.patch(f"{BASE_URL}/api/admin/comments/{cid}",
                      headers=headers, json={"status": "approved"})
        assert r.status_code == 200
        assert r.json()["status"] == "approved"

        # Public list should contain approved, not pending ones
        r = api.get(f"{BASE_URL}/api/comments/tutorial/{SAMPLE_SLUG}")
        assert r.status_code == 200
        contents = [c["content"] for c in r.json()]
        statuses = {c["status"] for c in r.json()}
        assert content_token in contents
        assert statuses == {"approved"} or statuses == set()  # only approved

        # cleanup
        api.delete(f"{BASE_URL}/api/admin/comments/{cid}", headers=headers)


# ==================== ADMIN COMMENTS ====================
class TestAdminComments:
    def test_list_requires_auth(self, api):
        r = requests.get(f"{BASE_URL}/api/admin/comments")
        assert r.status_code == 401

    def test_patch_requires_auth(self, api):
        r = requests.patch(f"{BASE_URL}/api/admin/comments/fake-id",
                           json={"status": "approved"})
        assert r.status_code == 401

    def test_delete_requires_auth(self, api):
        r = requests.delete(f"{BASE_URL}/api/admin/comments/fake-id")
        assert r.status_code == 401

    def test_admin_full_moderation_flow(self, api, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        # create a pending comment
        r = api.post(f"{BASE_URL}/api/comments", json={
            "tutorial_slug": SAMPLE_SLUG,
            "author": "TEST_Mod",
            "content": f"TEST_MOD {uuid.uuid4().hex[:6]}",
        })
        assert r.status_code == 201
        cid = r.json()["id"]

        # List all
        r = api.get(f"{BASE_URL}/api/admin/comments", headers=headers)
        assert r.status_code == 200
        assert any(c["id"] == cid for c in r.json())

        # Filter pending
        r = api.get(f"{BASE_URL}/api/admin/comments?status_filter=pending",
                    headers=headers)
        assert r.status_code == 200
        assert all(c["status"] == "pending" for c in r.json())
        assert any(c["id"] == cid for c in r.json())

        # Reject
        r = api.patch(f"{BASE_URL}/api/admin/comments/{cid}",
                      headers=headers, json={"status": "rejected"})
        assert r.status_code == 200
        assert r.json()["status"] == "rejected"

        # Filter rejected contains it
        r = api.get(f"{BASE_URL}/api/admin/comments?status_filter=rejected",
                    headers=headers)
        assert any(c["id"] == cid for c in r.json())

        # Approve
        r = api.patch(f"{BASE_URL}/api/admin/comments/{cid}",
                      headers=headers, json={"status": "approved"})
        assert r.status_code == 200
        assert r.json()["status"] == "approved"

        # Delete
        r = api.delete(f"{BASE_URL}/api/admin/comments/{cid}", headers=headers)
        assert r.status_code == 204

        # 404 on re-delete
        r = api.delete(f"{BASE_URL}/api/admin/comments/{cid}", headers=headers)
        assert r.status_code == 404

    def test_creator_can_moderate(self, api, creator_token):
        headers = {"Authorization": f"Bearer {creator_token}"}
        r = api.get(f"{BASE_URL}/api/admin/comments", headers=headers)
        assert r.status_code == 200


# ==================== UPLOADS ====================
class TestUploads:
    def test_upload_requires_auth(self, api):
        files = {"file": ("t.png", io.BytesIO(PNG_BYTES), "image/png")}
        r = requests.post(f"{BASE_URL}/api/admin/uploads", files=files)
        assert r.status_code == 401

    def test_upload_png_and_serve(self, api, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        files = {"file": ("TEST.png", io.BytesIO(PNG_BYTES), "image/png")}
        r = requests.post(f"{BASE_URL}/api/admin/uploads",
                          headers=headers, files=files)
        assert r.status_code == 201 or r.status_code == 200, r.text
        data = r.json()
        assert "path" in data and "url" in data
        assert data["path"].startswith("mouette/thumbnails/")
        assert data["url"].startswith("/api/files/")
        assert data["path"].endswith(".png")

        # Fetch without auth
        served = requests.get(f"{BASE_URL}{data['url']}")
        assert served.status_code == 200, served.text
        assert "image" in served.headers.get("content-type", "").lower()
        assert served.content == PNG_BYTES

    def test_upload_rejects_non_image(self, api, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        files = {"file": ("doc.txt", io.BytesIO(b"hello"), "text/plain")}
        r = requests.post(f"{BASE_URL}/api/admin/uploads",
                          headers=headers, files=files)
        assert r.status_code == 400

    def test_upload_rejects_too_large(self, api, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        big = b"\x89PNG\r\n\x1a\n" + b"0" * (3 * 1024 * 1024 + 10)
        files = {"file": ("big.png", io.BytesIO(big), "image/png")}
        r = requests.post(f"{BASE_URL}/api/admin/uploads",
                          headers=headers, files=files)
        assert r.status_code == 400

    def test_files_404(self, api):
        r = requests.get(f"{BASE_URL}/api/files/mouette/thumbnails/does-not-exist-xyz.png")
        assert r.status_code == 404
