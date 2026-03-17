import { useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  AccountCircle,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProfileModal from "@/components/ProfileModal";
import { AuthService } from "@/services/auth.service";
import type { CurrentUser } from "@/services/auth.service";

interface DashboardLayoutProps {
  children: ReactNode;
  user: CurrentUser | null;
}

const drawerWidth = 288;
// const drawerWidth = 0;
const miniDrawerWidth = 72;

function getGlassHeaderSx(isDark: boolean) {
  return {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    ...(isDark
      ? {
          background: "rgba(15, 20, 28, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
        }
      : {
          background: "rgba(255, 255, 255, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 4px 24px -1px rgba(0, 0, 0, 0.05), 0 2px 12px -1px rgba(0, 0, 0, 0.02)",
        }),
  };
}

export default function DashboardLayout({
  children,
  user,
}: DashboardLayoutProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleDrawerToggle = () => setSidebarOpen(!sidebarOpen);
  const handleMenuClose = () => setAnchorEl(null);
  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile) setAnchorEl(e.currentTarget);
    else setProfileModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        onToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
        miniDrawerWidth={miniDrawerWidth}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Box
          component="header"
          sx={{
            ...getGlassHeaderSx(isDark),
            ...(isDark && { borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }),
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isMobile && (
              <IconButton onClick={handleDrawerToggle} size="small">
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
              Admin Panel
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
              onClick={handleUserMenuOpen}
            >
              <AccountCircle sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.875rem" }}>
                {user?.userinfo?.name || user?.userinfo?.email || "Admin"}
              </Typography>
            </Box>
            <Button
              startIcon={<LogoutIcon sx={{ color: "primary.main" }} />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "text.primary",
                "&:hover": { color: "primary.main" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", p: 3, width: "100%" }}>
          {children}
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => { setProfileModalOpen(true); handleMenuClose(); }}>
          <PersonIcon sx={{ mr: 1 }} /> Profile
        </MenuItem>
        <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
          <LogoutIcon sx={{ mr: 1 }} /> Logout
        </MenuItem>
      </Menu>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
      />
    </Box>
  );
}
