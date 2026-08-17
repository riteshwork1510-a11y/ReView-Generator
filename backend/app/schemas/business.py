from typing import Optional, List
from pydantic import BaseModel, EmailStr, AnyHttpUrl, field_validator, Field
from datetime import datetime

class BusinessBase(BaseModel):
    company_name: str = Field(..., max_length=150)
    services_products: str = Field(..., max_length=1000)
    google_review_url: AnyHttpUrl
    call_number: Optional[str] = Field(None, max_length=30)
    whatsapp_number: Optional[str] = Field(None, max_length=30)
    website: Optional[AnyHttpUrl] = None
    location: Optional[str] = Field(None, max_length=200)
    address: Optional[str] = Field(None, max_length=500)
    contact_number: Optional[str] = Field(None, max_length=30)
    email: Optional[EmailStr] = Field(None, max_length=255)
    owner_name: Optional[str] = Field(None, max_length=150)
    owner_role: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, description="URL or base64 data URL of the image")
    slug: Optional[str] = Field(None, max_length=350)

    @field_validator('google_review_url', mode='after')
    def validate_https(cls, v):
        if hasattr(v, 'scheme') and v.scheme != 'https':
            raise ValueError('URL must use HTTPS')
        elif isinstance(v, str) and not v.startswith('https://'):
            raise ValueError('URL must use HTTPS')
        return v

    @field_validator('company_name', 'services_products', 'location', 'address')
    def trim_whitespace(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if not v:
                raise ValueError('Field cannot be empty')
        return v

class BusinessCreate(BusinessBase):
    pass

class BusinessUpdate(BaseModel):
    company_name: Optional[str] = Field(None, max_length=150)
    services_products: Optional[str] = Field(None, max_length=1000)
    google_review_url: Optional[AnyHttpUrl] = None
    call_number: Optional[str] = Field(None, max_length=30)
    whatsapp_number: Optional[str] = Field(None, max_length=30)
    website: Optional[AnyHttpUrl] = None
    location: Optional[str] = Field(None, max_length=200)
    address: Optional[str] = Field(None, max_length=500)
    contact_number: Optional[str] = Field(None, max_length=30)
    email: Optional[EmailStr] = Field(None, max_length=255)
    owner_name: Optional[str] = Field(None, max_length=150)
    owner_role: Optional[str] = Field(None, max_length=100)
    image_url: Optional[str] = Field(None, description="URL or base64 data URL of the image")

    @field_validator('google_review_url', mode='after')
    def validate_https(cls, v):
        if v is None:
            return v
        if hasattr(v, 'scheme') and v.scheme != 'https':
            raise ValueError('URL must use HTTPS')
        elif isinstance(v, str) and not v.startswith('https://'):
            raise ValueError('URL must use HTTPS')
        return v

class BusinessResponse(BusinessBase):
    id: str
    created_at: datetime
    updated_at: datetime

class PaginationInfo(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int

class BusinessListResponse(BaseModel):
    success: bool
    data: List[BusinessResponse]
    pagination: PaginationInfo
