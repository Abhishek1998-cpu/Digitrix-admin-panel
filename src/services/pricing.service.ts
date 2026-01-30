import { ApiService } from "./api.service";

export interface PricingTier {
  _id: string;
  tierKey: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  limits: {
    channels: number;
    postsPerMonth: number;
    teamMembers: number;
  };
  features: {
    basicScheduling: boolean;
    basicAnalytics: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
  };
  stripePriceId: {
    monthly: string | null;
    yearly: string | null;
  };
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetPricingTiersResponse {
  success: boolean;
  data: PricingTier[];
}

export interface UpdatePricingTierRequest {
  name?: string;
  price?: {
    monthly: number;
    yearly: number;
  };
  limits?: {
    channels: number;
    postsPerMonth: number;
    teamMembers: number;
  };
  features?: {
    basicScheduling: boolean;
    basicAnalytics: boolean;
    advancedAnalytics: boolean;
    prioritySupport: boolean;
    customBranding: boolean;
  };
  stripePriceId?: {
    monthly: string | null;
    yearly: string | null;
  };
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdatePricingTierResponse {
  success: boolean;
  message: string;
  data: PricingTier;
}

export const PricingService = {
  getPricingTiers: (): Promise<GetPricingTiersResponse> => {
    return ApiService.get("/v1/system-admin/pricing");
  },

  updatePricingTier: (
    tierKey: string,
    payload: UpdatePricingTierRequest
  ): Promise<UpdatePricingTierResponse> => {
    return ApiService.put(`/v1/system-admin/pricing/${tierKey}`, payload);
  },
};
