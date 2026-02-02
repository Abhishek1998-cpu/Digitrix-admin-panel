import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { AuthService } from "@/services/auth.service";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import DashboardHome from "./DashboardHome";
import PricingManagement from "./sections/PricingManagement";
import OrganizationManagement from "./sections/OrganizationManagement";
import UserManagement from "./sections/UserManagement";
import SystemAnalytics from "./sections/SystemAnalytics";
import FeatureFlags from "./sections/FeatureFlags";
import AiModelConfiguration from "./sections/AiModelConfiguration";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSystemAdmin, setIsSystemAdmin] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUserAndCheckAdmin = async () => {
      try {
        // Fetch user data
        const userData = await AuthService.getCurrentUser();

        if (!isMounted) return;
        setUser(userData);

        // Check system admin status
        const adminStatus = await AuthService.checkSystemAdminStatus();

        if (!isMounted) return;
        setIsSystemAdmin(adminStatus.isSystemAdmin);

        // If user is not a system admin, redirect to login
        if (!adminStatus.isSystemAdmin) {
          navigate("/login", { replace: true });
        }
      } catch (error: any) {
        // If any authentication check fails, redirect to login
        console.error("Authentication check failed:", error);
        if (isMounted) {
          navigate("/login", { replace: true });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserAndCheckAdmin();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user}>
      <Routes>
        <Route path="/" element={<DashboardHome isSystemAdmin={isSystemAdmin} />} />
        <Route path="/pricing" element={<PricingManagement />} />
        <Route path="/organizations" element={<OrganizationManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/analytics" element={<SystemAnalytics />} />
        <Route path="/feature-flags" element={<FeatureFlags />} />
        <Route path="/ai-models" element={<AiModelConfiguration />} />
      </Routes>
    </DashboardLayout>
  );
}
