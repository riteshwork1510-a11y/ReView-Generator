def serialize_mongo_settings(doc: dict) -> dict:
    """Convert MongoDB settings document to dict ready for Pydantic."""
    if not doc:
        return None
    
    return {
        "id": str(doc.get("_id", doc.get("id"))),
        "application_name": doc.get("application_name"),
        "review_cta_text": doc.get("review_cta_text"),
        "show_google_review_button": doc.get("show_google_review_button"),
        "show_call_action": doc.get("show_call_action"),
        "show_whatsapp_action": doc.get("show_whatsapp_action"),
        "show_email_action": doc.get("show_email_action"),
        "show_website_action": doc.get("show_website_action"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at")
    }
