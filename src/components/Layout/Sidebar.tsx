import type { ReactElement } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
  styled,
} from "@mui/material";
import {
  AttachMoney as PricingIcon,
  Business as OrgIcon,
  People as UsersIcon,
  BarChart as AnalyticsIcon,
  Flag as FlagsIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  SmartToy as AiIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
  miniDrawerWidth: number;
}

interface MenuItem {
  text: string;
  icon: ReactElement;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  {
    text: "Pricing Management",
    icon: <PricingIcon />,
    path: "/dashboard/pricing",
  },
  {
    text: "Organization Management",
    icon: <OrgIcon />,
    path: "/dashboard/organizations",
  },
  { text: "User Management", icon: <UsersIcon />, path: "/dashboard/users" },
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
];

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "drawerWidth" && prop !== "miniDrawerWidth",
})<{ open: boolean; drawerWidth: number; miniDrawerWidth: number }>(
  ({ theme, open, drawerWidth, miniDrawerWidth }) => ({
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
    },
  })
);

export default function Sidebar({
  open,
  onClose,
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
    <Box>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        {isMobile && (
          <IconButton onClick={onClose}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
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
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(15, 135, 255, 0.08)",
                    borderRight: open ? `3px solid #0f87ff` : "none",
                    "&:hover": {
                      backgroundColor: "rgba(15, 135, 255, 0.12)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(15, 135, 255, 0.04)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#0f87ff" : "inherit",
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
                    color: isActive ? "#0f87ff" : "inherit",
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
