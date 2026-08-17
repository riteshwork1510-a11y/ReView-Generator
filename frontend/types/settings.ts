export interface ApplicationSettings {
  id: string;
  application_name: string;
  review_cta_text: string;
  show_google_review_button: boolean;
  show_call_action: boolean;
  show_whatsapp_action: boolean;
  show_email_action: boolean;
  show_website_action: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicationSettingsUpdate {
  application_name?: string;
  review_cta_text?: string;
  show_google_review_button?: boolean;
  show_call_action?: boolean;
  show_whatsapp_action?: boolean;
  show_email_action?: boolean;
  show_website_action?: boolean;
}

export interface ApplicationSettingsResponse {
  success: boolean;
  data: ApplicationSettings;
}

export interface ApplicationSettingsFormValues {
  application_name: string;
  review_cta_text: string;
  show_google_review_button: boolean;
  show_call_action: boolean;
  show_whatsapp_action: boolean;
  show_email_action: boolean;
  show_website_action: boolean;
}
