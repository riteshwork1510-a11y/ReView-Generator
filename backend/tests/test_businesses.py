import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_valid_business(monkeypatch):
    # Mock the repository
    async def mock_create(*args, **kwargs):
        return {
            "id": "123",
            "company_name": "ABC Corp",
            "services_products": "Software",
            "google_review_url": "https://g.page/review",
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-01T00:00:00Z"
        }
    monkeypatch.setattr("app.repositories.business_repository.business_repository.create_business", mock_create)

    response = client.post("/api/v1/businesses", json={
        "company_name": "ABC Corp",
        "services_products": "Software",
        "google_review_url": "https://g.page/review"
    })
    
    assert response.status_code == 201
    assert response.json()["success"] is True

def test_reject_missing_company_name():
    response = client.post("/api/v1/businesses", json={
        "services_products": "Software",
        "google_review_url": "https://g.page/review"
    })
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

def test_reject_invalid_email():
    response = client.post("/api/v1/businesses", json={
        "company_name": "ABC Corp",
        "services_products": "Software",
        "google_review_url": "https://g.page/review",
        "email": "not-an-email"
    })
    assert response.status_code == 422

def test_get_business(monkeypatch):
    async def mock_get(*args, **kwargs):
        return {
            "id": "60d5ec49f1b2c8a1b8e4f1a2",
            "company_name": "ABC Corp",
            "services_products": "Software",
            "google_review_url": "https://g.page/review",
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-01T00:00:00Z"
        }
    monkeypatch.setattr("app.repositories.business_repository.business_repository.get_business_by_id", mock_get)

    response = client.get("/api/v1/businesses/60d5ec49f1b2c8a1b8e4f1a2")
    assert response.status_code == 200
    assert response.json()["data"]["company_name"] == "ABC Corp"

def test_get_nonexistent_business(monkeypatch):
    async def mock_get(*args, **kwargs):
        return None
    monkeypatch.setattr("app.repositories.business_repository.business_repository.get_business_by_id", mock_get)

    response = client.get("/api/v1/businesses/60d5ec49f1b2c8a1b8e4f1a2")
    assert response.status_code == 404
    assert response.json()["error_code"] == "BUSINESS_NOT_FOUND"

def test_invalid_business_id():
    response = client.get("/api/v1/businesses/invalid-id")
    assert response.status_code == 400
    assert response.json()["error_code"] == "INVALID_ID"

def test_empty_update():
    response = client.put("/api/v1/businesses/60d5ec49f1b2c8a1b8e4f1a2", json={})
    assert response.status_code == 400
    assert response.json()["error_code"] == "EMPTY_UPDATE"
