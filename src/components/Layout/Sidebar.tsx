import type { ReactElement } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Button,
  styled,
} from "@mui/material";
import {
  AutoGraph as LogoIcon,
  Dashboard as DashboardIcon,
  Payments as PricingIcon,
  CorporateFare as OrgIcon,
  People as UsersIcon,
  BarChart as AnalyticsIcon,
  Flag as FlagsIcon,
  Psychology as AiIcon,
  IntegrationInstructions as IntegrationsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useColorMode } from "@/theme/colorMode";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onToggle?: () => void;
  drawerWidth: number;
  miniDrawerWidth: number;
}

interface MenuItem {
  text: string;
  icon: ReactElement;
  path: string;
}

function ThemeToggleButton() {
  const { mode, toggleColorMode } = useColorMode();
  return (
    <Button
      fullWidth
      startIcon={mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      onClick={toggleColorMode}
      sx={{
        justifyContent: "center",
        textTransform: "none",
        color: "text.secondary",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      Toggle Theme
    </Button>
  );
}

const menuItems: MenuItem[] = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Pricing", icon: <PricingIcon />, path: "/dashboard/pricing" },
  {
    text: "Organizations",
    icon: <OrgIcon />,
    path: "/dashboard/organizations",
  },
  { text: "Users", icon: <UsersIcon />, path: "/dashboard/users" },
  {
    text: "System Analytics",
    icon: <AnalyticsIcon />,
    path: "/dashboard/analytics",
  },
  {
    text: "Feature Flags",
    icon: <FlagsIcon />,
    path: "/dashboard/feature-flags",
  },
  {
    text: "AI Model Configuration",
    icon: <AiIcon />,
    path: "/dashboard/ai-models",
  },
  {
    text: "Integrations",
    icon: <IntegrationsIcon />,
    path: "/dashboard/integrations",
  },
];

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "drawerWidth" && prop !== "miniDrawerWidth",
})<{ open: boolean; drawerWidth: number; miniDrawerWidth: number }>(
  ({ theme, open, drawerWidth, miniDrawerWidth }) => {
    const isDark = theme.palette.mode === "dark";
    return {
      width: open ? drawerWidth : miniDrawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      "& .MuiDrawer-paper": {
        width: open ? drawerWidth : miniDrawerWidth,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: "hidden",
        boxSizing: "border-box",
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
              boxShadow:
                "0 4px 24px -1px rgba(0, 0, 0, 0.05), 0 2px 12px -1px rgba(0, 0, 0, 0.02)",
            }),
      },
    };
  }
);

export default function Sidebar({
  open,
  onClose,
  onToggle,
  drawerWidth,
  miniDrawerWidth,
}: SidebarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        {isMobile && (
          <IconButton onClick={onClose} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
        <IconButton
          onClick={onToggle}
          disableRipple
          sx={{
            p: 0,
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            <LogoIcon sx={{ fontSize: 20 }} />
          </Box>
        </IconButton>
        {open && (
          <Box
            component="span"
            sx={{ fontWeight: 700, fontSize: "1.25rem", color: "text.primary" }}
          >
            DulyPlan
          </Box>
        )}
      </Box>
      <List sx={{ flex: 1, py: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  "&.Mui-selected": {
                    ...(theme.palette.mode === "dark"
                      ? {
                          background: "linear-gradient(90deg, rgba(15, 135, 255, 0.2) 0%, rgba(15, 135, 255, 0) 100%)",
                          borderLeft: "3px solid",
                          borderLeftColor: "primary.main",
                          color: "#ffffff",
                        }
                      : {
                          backgroundColor: "rgba(15, 135, 255, 0.1)",
                          color: "#0f87ff",
                        }),
                    "&:hover": {
                      ...(theme.palette.mode === "dark"
                        ? {
                            background: "linear-gradient(90deg, rgba(15, 135, 255, 0.25) 0%, rgba(15, 135, 255, 0) 100%)",
                          }
                        : { backgroundColor: "rgba(15, 135, 255, 0.15)" }),
                    },
                  },
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "primary.main" : "inherit",
                    minWidth: 0,
                    mr: open ? 1.5 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "primary.main" : "inherit",
                  }}
                  sx={{
                    opacity: open ? 1 : 0,
                    display: open ? "block" : "none",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <ThemeToggleButton />
      </Box>
    </Box>
  );

  // Mobile temporary drawer - full width when open
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop mini/full drawer
  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      drawerWidth={drawerWidth}
      miniDrawerWidth={miniDrawerWidth}
    >
      {drawerContent}
    </StyledDrawer>
  );
}
