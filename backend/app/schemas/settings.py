from typing import Optional
from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class ApplicationSettingsBase(BaseModel):
    application_name: str = Field(..., min_length=1, max_length=100)
    review_cta_text: str = Field(..., min_length=1, max_length=60)
    show_google_review_button: bool
    show_call_action: bool
    show_whatsapp_action: bool
    show_email_action: bool
    show_website_action: bool

    @field_validator('application_name', 'review_cta_text')
    def trim_whitespace(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if not v:
                raise ValueError('Field cannot be empty')
        return v

class ApplicationSettingsUpdate(BaseModel):
    application_name: Optional[str] = Field(None, min_length=1, max_length=100)
    review_cta_text: Optional[str] = Field(None, min_length=1, max_length=60)
    show_google_review_button: Optional[bool] = None
    show_call_action: Optional[bool] = None
    show_whatsapp_action: Optional[bool] = None
    show_email_action: Optional[bool] = None
    show_website_action: Optional[bool] = None
    
    @field_validator('application_name', 'review_cta_text')
    def trim_whitespace(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if not v:
                raise ValueError('Field cannot be empty')
        return v

class ApplicationSettingsResponse(ApplicationSettingsBase):
    id: str
    created_at: datetime
    updated_at: datetime
