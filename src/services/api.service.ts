import { api } from '@/common/api-config';

export class ApiService {
  static async get<T>(url: string, params?: object): Promise<T> {
    try {
      const config =
        params && typeof params === "object" && Object.prototype.hasOwnProperty.call(params, "params")
          ? params
          : params
          ? { params }
          : undefined;
      const response = await api.get<T>(url, config);
      return response.data;
    } catch (error) {
      console.error('GET Error:', error);
      throw error;
    }
  }

  static async post<T>(url: string, data?: unknown, params?: object): Promise<T> {
    try {
      const response = await api.post<T>(url, data, { params });
      return response.data;
    } catch (error) {
      console.error('POST Error:', error);
      throw error;
    }
  }

  static async put<T>(url: string, data?: unknown, params?: object): Promise<T> {
    try {
      const response = await api.put<T>(url, data, { params });
      return response.data;
    } catch (error) {
      console.error('PUT Error:', error);
      throw error;
    }
  }

  static async patch<T>(url: string, data?: unknown, params?: object): Promise<T> {
    try {
      const response = await api.patch<T>(url, data, { params });
      return response.data;
    } catch (error) {
      console.error('PATCH Error:', error);
      throw error;
    }
  }

  static async delete<T>(url: string, data?: unknown, params?: object): Promise<T> {
    try {
      const response = await api.delete<T>(url, data, { params });
      return response.data;
    } catch (error) {
      console.error('DELETE Error:', error);
      throw error;
    }
  }
}
