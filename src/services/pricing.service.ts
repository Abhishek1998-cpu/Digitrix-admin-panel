import { ApiService } from "./api.service";

export interface PricingTier {
  _id: string;
  tierKey: string;
  name: string;
  description?: string;
  currency?: string;
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
  stripeProductId?: string | null;
  stripePriceId: {
    monthly: string | null;
    yearly: string | null;
  };
  isActive: boolean;
  isPopular?: boolean;
  sortOrder: number;
  syncSource?: "stripe" | "manual" | string;
  syncedAt?: string;
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

export interface GetPricingTiersOptions {
  syncFromStripe?: boolean;
}

export const PricingService = {
  getPricingTiers: (
    options: GetPricingTiersOptions = {}
  ): Promise<GetPricingTiersResponse> => {
    return ApiService.get(
      "/v1/system-admin/pricing",
      options.syncFromStripe ? { sync: "stripe" } : undefined
    );
  },

  updatePricingTier: (
    tierKey: string,
    payload: UpdatePricingTierRequest
  ): Promise<UpdatePricingTierResponse> => {
    return ApiService.put(`/v1/system-admin/pricing/${tierKey}`, payload);
  },
};
