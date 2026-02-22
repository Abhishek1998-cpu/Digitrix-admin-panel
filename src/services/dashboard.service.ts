import { ApiService } from "./api.service";
import { UserService } from "./user.service";
import { OrgService } from "./org.service";

/** Backend health endpoint (relative to API_ROOT, e.g. http://local.dulyplan.com:8085/_healthz) */
const HEALTH_URL = "/_healthz";

export const DashboardService = {
  /**
   * Get total users count from the users API (pagination total).
   */
  async getTotalUsers(): Promise<number> {
    const res = await UserService.getAllUsers({ page: 1, limit: 1 });
    return res.pagination?.totalUsers ?? 0;
  },

  /**
   * Get total organizations count from the organizations stats API.
   */
  async getTotalOrganizations(): Promise<number> {
    const res = await OrgService.getOrganizationStats();
    return res.data?.totalOrgs ?? 0;
  },

  /**
   * Call backend health check API (GET /_healthz). On success returns 100 (percent); on failure returns 0.
   */
  async getSystemHealthPercent(): Promise<number> {
    try {
      await ApiService.get<{ status?: string; ok?: boolean }>(HEALTH_URL);
      return 100;
    } catch {
      return 0;
    }
  },
};
