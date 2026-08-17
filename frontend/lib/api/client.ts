import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let message = 'An unexpected error occurred.';
    let code = 'API_ERROR';

    if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError') {
      message = 'Request canceled';
      code = 'CANCELED';
    } else if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. Please try again.';
      code = 'TIMEOUT';
    } else if (!error.response) {
      message = 'Network error. Please check your connection.';
      code = 'NETWORK_ERROR';
    } else {
      const data = error.response.data;
      if (data && typeof data === 'object') {
        if (data.detail && Array.isArray(data.detail) && data.detail.length > 0) {
          message = `${data.detail[0].loc.join('.')}: ${data.detail[0].msg}`;
          code = 'VALIDATION_ERROR';
        } else if (data.detail && typeof data.detail === 'string') {
          message = data.detail;
          code = 'API_ERROR';
        } else {
          message = data.message || message;
          code = data.error_code || 'API_ERROR';
        }
      }
    }

    const apiError = new ApiError(message, status, code);

    // Suppress logging for intentional cancellations
    if (code !== 'CANCELED') {
      console.error('API Error:', {
        message: apiError.message,
        code: apiError.code,
        status: apiError.status,
      });
    }

    return Promise.reject(apiError);
  }
);
