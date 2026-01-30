import { ApiService } from "./api.service";

export interface User {
  _id: string;
  uuid: string;
  name: string;
  email: string;
  org_id?: {
    _id: string;
    name: string;
    org_id: string;
  };
  tier?: string;
  isSystemAdmin: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profile_picture_url?: string;
  userMeta?: {
    bio?: string;
    company?: string;
    jobTitle?: string;
    timezone?: string;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  orgId?: string;
  tier?: string;
  isSystemAdmin?: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Organization {
  _id: string;
  org_id: string;
  name: string;
}

export interface GetOrganizationsResponse {
  success: boolean;
  data: Organization[];
}

export interface UpdateUserRequest {
  name?: string;
  tier?: string;
  isSystemAdmin?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface GetUserByIdResponse {
  success: boolean;
  data: User;
}

export const UserService = {
  /**
   * Get all users with pagination and filters
   */
  getAllUsers: (params: GetUsersParams): Promise<GetUsersResponse> => {
    return ApiService.get("/v1/system-admin/users", params);
  },

  /**
   * Get user by ID
   */
  getUserById: (userId: string): Promise<GetUserByIdResponse> => {
    return ApiService.get(`/v1/system-admin/users/${userId}`);
  },

  /**
   * Get all organizations (simple list for filters)
   */
  getAllOrganizations: (): Promise<GetOrganizationsResponse> => {
    return ApiService.get("/v1/system-admin/organizations-filter");
  },

  /**
   * Update user
   */
  updateUser: (userId: string, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    return ApiService.put(`/v1/system-admin/users/${userId}`, data);
  },

  /**
   * Delete user
   */
  deleteUser: (userId: string): Promise<DeleteUserResponse> => {
    return ApiService.delete(`/v1/system-admin/users/${userId}`);
  },
};
