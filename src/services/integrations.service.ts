import { ApiService } from "./api.service";

export interface Integration {
  platform: string;
  status: "configured" | "not_configured";
  redirectUri: string | null;
  authUrl: string | null;
  docsLink: string | null;
  /** Masked app/client ID (e.g. ••••••••abc1). Never the full value. */
  appIdMasked: string | null;
  /** Whether the app/client secret is set in env. */
  hasSecret: boolean;
}

export interface GetIntegrationsResponse {
  integrations: Integration[];
}

export interface ChannelSummary {
  _id: string;
  uuid: string;
  platform: string;
  account_name: string;
  org_id: string;
  user_id: string;
  expires_at: string;
  profile?: { id?: string; username?: string; picture?: string };
  metadata?: { token_type?: string; scope?: string };
  createdAt: string;
  tokenStatus: "ok" | "expires_soon" | "expired";
}

export interface GetChannelsParams {
  orgId?: string;
  platform?: string;
  expired?: "true";
  expiringWithin?: number;
}

export interface GetChannelsResponse {
  channels: ChannelSummary[];
}

export const IntegrationsService = {
  getIntegrations: (): Promise<GetIntegrationsResponse> => {
    return ApiService.get("/v1/system-admin/integrations");
  },

  getChannels: (params?: GetChannelsParams): Promise<GetChannelsResponse> => {
    return ApiService.get("/v1/system-admin/channels", { params });
  },
};
