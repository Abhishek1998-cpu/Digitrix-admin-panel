import { useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  AppBar,
  Toolbar,
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

interface DashboardLayoutProps {
  children: ReactNode;
  user: any;
}

const drawerWidth = 285;
const miniDrawerWidth = 65;

export default function DashboardLayout({
  children,
  user,
}: DashboardLayoutProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#0f87ff",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            DulyPlan Admin Panel
          </Typography>

          {!isMobile && user && (
            <>
              <IconButton
                color="inherit"
                onClick={() => setProfileModalOpen(true)}
                sx={{ mr: 1 }}
                title="View Profile"
              >
                <PersonIcon />
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "block" },
                }}
              >
                {user.userinfo?.name || user.userinfo?.email || "Admin"}
              </Typography>
            </>
          )}

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {user && (
                  <MenuItem disabled>
                    <Typography variant="body2">
                      {user.userinfo?.name || user.userinfo?.email || "Admin"}
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    setProfileModalOpen(true);
                    handleMenuClose();
                  }}
                >
                  <PersonIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Sidebar
        open={sidebarOpen}
        onClose={handleDrawerToggle}
        drawerWidth={drawerWidth}
        miniDrawerWidth={miniDrawerWidth}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          minHeight: "100vh",
          width: 100,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
      />
    </Box>
  );
}
