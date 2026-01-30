import { ApiService } from "./api.service";

export interface OrgOwner {
  _id: string;
  name: string;
  email: string;
  profile_picture_url?: string;
}

export interface OrgMember {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
  };
  role_id: {
    _id: string;
    name: string;
  };
  status: string;
}

export interface Organization {
  _id: string;
  org_id: string;
  name: string;
  owner_id?: string;
  owner?: OrgOwner;
  memberCount?: number;
  members?: OrgMember[];
  stripeCustomerId?: string;
  defaultPermission?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrganizationsParams {
  page?: number;
  limit?: number;
  search?: string;
  tier?: string;
}

export interface GetOrganizationsResponse {
  success: boolean;
  data: Organization[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrgs: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface GetOrganizationByIdResponse {
  success: boolean;
  data: Organization;
}

export interface UpdateOrganizationRequest {
  name?: string;
  defaultPermission?: string;
}

export interface UpdateOrganizationResponse {
  success: boolean;
  message: string;
  data: Organization;
}

export interface DeleteOrganizationResponse {
  success: boolean;
  message: string;
}

export interface OrganizationStatsResponse {
  success: boolean;
  data: {
    totalOrgs: number;
    activeOrgs: number;
  };
}

export const OrgService = {
  /**
   * Get all organizations with pagination and filters
   */
  getAllOrganizations: (params: GetOrganizationsParams): Promise<GetOrganizationsResponse> => {
    return ApiService.get("/v1/system-admin/organizations", params);
  },

  /**
   * Get organization by ID
   */
  getOrganizationById: (orgId: string): Promise<GetOrganizationByIdResponse> => {
    return ApiService.get(`/v1/system-admin/organizations/${orgId}`);
  },

  /**
   * Update organization
   */
  updateOrganization: (orgId: string, data: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> => {
    return ApiService.put(`/v1/system-admin/organizations/${orgId}`, data);
  },

  /**
   * Delete organization
   */
  deleteOrganization: (orgId: string): Promise<DeleteOrganizationResponse> => {
    return ApiService.delete(`/v1/system-admin/organizations/${orgId}`);
  },

  /**
   * Get organization statistics
   */
  getOrganizationStats: (): Promise<OrganizationStatsResponse> => {
    return ApiService.get("/v1/system-admin/organizations/stats");
  },
};
