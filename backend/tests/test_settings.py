import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_settings_default(monkeypatch):
    async def mock_get_settings(*args, **kwargs):
        return {
            "id": "123",
            "application_name": "AI Review Generator",
            "review_cta_text": "Give 5-Star Google Review",
            "show_google_review_button": True,
            "show_call_action": True,
            "show_whatsapp_action": True,
            "show_email_action": True,
            "show_website_action": True,
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-01T00:00:00Z"
        }
    monkeypatch.setattr("app.repositories.settings_repository.settings_repository.get_settings", mock_get_settings)

    response = client.get("/api/v1/settings")
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["application_name"] == "AI Review Generator"

def test_update_settings_valid(monkeypatch):
    async def mock_get_settings(*args, **kwargs):
        return {
            "id": "123",
            "application_name": "Old App Name",
            "review_cta_text": "Give 5-Star Google Review",
            "show_google_review_button": True,
            "show_call_action": True,
            "show_whatsapp_action": True,
            "show_email_action": True,
            "show_website_action": True,
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-01T00:00:00Z"
        }

    async def mock_update_settings(*args, **kwargs):
        return {
            "id": "123",
            "application_name": "New App Name",
            "review_cta_text": "Please Review",
            "show_google_review_button": False,
            "show_call_action": True,
            "show_whatsapp_action": True,
            "show_email_action": True,
            "show_website_action": True,
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-01T00:00:00Z"
        }
    
    monkeypatch.setattr("app.repositories.settings_repository.settings_repository.get_settings", mock_get_settings)
    monkeypatch.setattr("app.repositories.settings_repository.settings_repository.update_settings", mock_update_settings)

    response = client.put("/api/v1/settings", json={
        "application_name": "New App Name",
        "review_cta_text": "Please Review",
        "show_google_review_button": False
    })
    
    assert response.status_code == 200
    assert response.json()["success"] is True

def test_update_settings_invalid_type():
    response = client.put("/api/v1/settings", json={
        "show_google_review_button": "not-a-boolean"
    })
    assert response.status_code == 422
    assert response.json()["error_code"] == "VALIDATION_ERROR"

