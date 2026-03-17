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

export interface CurrentUser {
  userinfo?: {
    name?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
    emailVerified?: boolean;
    isSystemAdmin?: boolean;
    profile_picture_url?: string;
    userMeta?: {
      bio?: string;
      company?: string;
      jobTitle?: string;
      timezone?: string;
      socialLinks?: { x?: string; facebook?: string; linkedin?: string };
    };
  };
}

export class AuthService {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    return ApiService.post<LoginResponse>('/v1/auth/login', data);
  }

  static async getCurrentUser(): Promise<CurrentUser> {
    return ApiService.get<CurrentUser>('/v1/auth/me');
  }

  static async logout(): Promise<{ message: string }> {
    return ApiService.post('/v1/auth/logout');
  }

  static async checkSystemAdminStatus(): Promise<SystemAdminStatusResponse> {
    return ApiService.get<SystemAdminStatusResponse>('/v1/system-admin/status');
  }
}
