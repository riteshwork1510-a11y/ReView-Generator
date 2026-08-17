import { apiClient } from './client';
import { ApplicationSettingsUpdate, ApplicationSettingsResponse } from '@/types/settings';

export const getSettings = async (): Promise<ApplicationSettingsResponse> => {
  const response = await apiClient.get<ApplicationSettingsResponse>('/settings');
  return response.data;
};

export const updateSettings = async (
  data: ApplicationSettingsUpdate
): Promise<ApplicationSettingsResponse> => {
  const response = await apiClient.put<ApplicationSettingsResponse>('/settings', data);
  return response.data;
};
