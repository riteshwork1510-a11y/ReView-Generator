export interface Business {
  id: string;
  company_name: string;
  services_products: string;
  call_number?: string;
  whatsapp_number?: string;
  website?: string;
  location?: string;
  address?: string;
  contact_number?: string;
  email?: string;
  google_review_url: string;
  image_url?: string;
  owner_name?: string;
  owner_role?: string;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessCreateInput {
  company_name: string;
  services_products: string;
  call_number?: string;
  whatsapp_number?: string;
  website?: string;
  location?: string;
  address?: string;
  contact_number?: string;
  email?: string;
  google_review_url: string;
  image_url?: string;
  owner_name?: string;
  owner_role?: string;
}

export type BusinessUpdateInput = Partial<BusinessCreateInput>;

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface BusinessListResponse {
  success: boolean;
  data: Business[];
  pagination: PaginationInfo;
}

export interface BusinessResponse {
  success: boolean;
  message: string;
  data: Business;
}
