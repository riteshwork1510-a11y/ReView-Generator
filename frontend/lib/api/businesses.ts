import { apiClient } from './client';
import { 
  BusinessCreateInput, 
  BusinessUpdateInput, 
  BusinessListResponse, 
  BusinessResponse 
} from '@/types/business';

export const businessesApi = {
  getBusinesses: async (page = 1, limit = 20, search = '', signal?: AbortSignal): Promise<BusinessListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);
    
    const response = await apiClient.get<BusinessListResponse>(`/businesses?${params.toString()}`, { signal });
    return response.data;
  },

  getBusiness: async (id: string): Promise<BusinessResponse> => {
    const response = await apiClient.get<BusinessResponse>(`/businesses/${id}`);
    return response.data;
  },

  getBusinessBySlug: async (slug: string): Promise<BusinessResponse> => {
    const response = await apiClient.get<BusinessResponse>(`/businesses/by-slug/${slug}`);
    return response.data;
  },

  createBusiness: async (data: BusinessCreateInput): Promise<BusinessResponse> => {
    const response = await apiClient.post<BusinessResponse>('/businesses', data);
    return response.data;
  },

  updateBusiness: async (id: string, data: BusinessUpdateInput): Promise<BusinessResponse> => {
    const response = await apiClient.put<BusinessResponse>(`/businesses/${id}`, data);
    return response.data;
  },

  deleteBusiness: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/businesses/${id}`);
    return response.data;
  }
};
