import { ApiService } from './api.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user?: {
    token: string;
    name: string;
    emailId: string;
  };
}

export interface SystemAdminStatusResponse {
  success: boolean;
  isSystemAdmin: boolean;
  user: {
    email: string;
    name: string;
  };
}

export class AuthService {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    return ApiService.post<LoginResponse>('/v1/auth/login', data);
  }

  static async getCurrentUser(): Promise<any> {
    return ApiService.get('/v1/auth/me');
  }

  static async logout(): Promise<{ message: string }> {
    return ApiService.post('/v1/auth/logout');
  }

  static async checkSystemAdminStatus(): Promise<SystemAdminStatusResponse> {
    return ApiService.get<SystemAdminStatusResponse>('/v1/system-admin/status');
  }
}
