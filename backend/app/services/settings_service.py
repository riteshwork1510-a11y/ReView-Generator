from app.repositories.settings_repository import settings_repository
from app.schemas.settings import ApplicationSettingsUpdate, ApplicationSettingsResponse
from app.utils.logger import get_logger

logger = get_logger(__name__)

DEFAULT_SETTINGS = {
    "application_name": "AI Review Generator",
    "review_cta_text": "Give 5-Star Google Review",
    "show_google_review_button": True,
    "show_call_action": True,
    "show_whatsapp_action": True,
    "show_email_action": True,
    "show_website_action": True,
}

class SettingsService:
    async def get_settings(self) -> dict:
        settings = await settings_repository.get_settings()
        if not settings:
            # Initialize with default settings
            settings = await settings_repository.create_settings(DEFAULT_SETTINGS.copy())
            logger.info("Initialized default application settings")
            
        # Migration safety: Handle missing fields in existing documents
        needs_update = False
        update_data = {}
        for key, value in DEFAULT_SETTINGS.items():
            if settings.get(key) is None:
                settings[key] = value
                update_data[key] = value
                needs_update = True
                
        if needs_update:
            settings = await settings_repository.update_settings(update_data)
            logger.info(f"Migrated application settings with missing fields: {list(update_data.keys())}")
            
        return settings

    async def update_settings(self, update_data: ApplicationSettingsUpdate) -> dict:
        # Get existing to ensure they exist
        await self.get_settings()
        
        update_dict = update_data.model_dump(exclude_unset=True)
        if not update_dict:
            return await self.get_settings()
            
        updated = await settings_repository.update_settings(update_dict)
        logger.info("Updated application settings")
        return updated

settings_service = SettingsService()
