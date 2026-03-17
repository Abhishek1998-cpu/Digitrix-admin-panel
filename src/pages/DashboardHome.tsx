import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  useTheme,
  Skeleton,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Group as GroupIcon,
  CorporateFare as CorporateFareIcon,
  Payments as PaymentsIcon,
  Speed as SpeedIcon,
  RocketLaunch as RocketLaunchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DashboardService } from "@/services/dashboard.service";

function getGlassPanelSx(isDark: boolean) {
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

interface DashboardHomeProps {
  isSystemAdmin: boolean;
}

export default function DashboardHome({ isSystemAdmin }: DashboardHomeProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const glassPanelSx = getGlassPanelSx(isDark);

  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalOrganizations, setTotalOrganizations] = useState<number | null>(null);
  const [systemHealthPercent, setSystemHealthPercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  // Demo timezone Autocomplete (kept for future use)
  // const [demoTimezone, setDemoTimezone] = useState<string>("Asia/Kolkata");
  // type TimezoneOption = {
  //   label: string;
  //   value: string;
  // };
  // const TIMEZONES: TimezoneOption[] = useMemo(() => {
  //   const timeZones = Intl.supportedValuesOf("timeZone");
  //   return timeZones.map((tz) => {
  //     const offset =
  //       new Intl.DateTimeFormat("en-US", {
  //         timeZone: tz,
  //         timeZoneName: "shortOffset",
  //       })
  //         .formatToParts(new Date())
  //         .find((p) => p.type === "timeZoneName")?.value || "";
  //
  //     return {
  //       label: `(GMT ${offset.slice(3)}) ${tz}`,
  //       value: tz,
  //     };
  //   });
  // }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchStats() {
      setLoading(true);
      try {
        const [users, orgs, health] = await Promise.all([
          DashboardService.getTotalUsers(),
          DashboardService.getTotalOrganizations(),
          DashboardService.getSystemHealthPercent(),
        ]);
        if (!cancelled) {
          setTotalUsers(users);
          setTotalOrganizations(orgs);
          setSystemHealthPercent(health);
        }
      } catch {
        if (!cancelled) {
          setTotalUsers(null);
          setTotalOrganizations(null);
          setSystemHealthPercent(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* System admin access alert */}
      {isSystemAdmin && (
        <Box
          sx={{
            ...glassPanelSx,
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderColor: "success.main",
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          <CheckCircleIcon sx={{ color: "success.main", fontSize: 24 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, color: "success.dark" }}>
            You have system administrator access.
          </Typography>
        </Box>
      )}

      {/* Title row + Welcome card */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Monitor your platform&apos;s health and manage configurations.
          </Typography>
        </Box>
        <Card
          variant="outlined"
          sx={{
            ...glassPanelSx,
            p: 2,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "rgba(15, 135, 255, 0.08)",
                borderRadius: 1,
                color: "primary.main",
              }}
            >
              <InfoIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Welcome back
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                Use the sidebar to navigate between sections.
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      {/* Demo: simple MUI timezone select (dummy data) */}
      {/* <Card
        variant="outlined"
        sx={{
          ...glassPanelSx,
          p: 2,
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Demo – Timezone (MUI Autocomplete)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This is a Material UI timezone dropdown with search & filter,
          using the same style of options as the schedule modal.
        </Typography>
        <Autocomplete<TimezoneOption, false, false, false>
          size="small"
          sx={{ minWidth: 280 }}
          options={TIMEZONES}
          getOptionLabel={(option) =>
            typeof option === "string"
              ? option
              : option.label || option.value || ""
          }
          value={
            TIMEZONES.find((tz) => tz.value === demoTimezone) || null
          }
          onChange={(_, newValue) => {
            setDemoTimezone(newValue ? newValue.value : demoTimezone);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Timezone"
              placeholder="Search timezone..."
            />
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
      </Card> */}

      {/* Metric cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
          gap: 3,
        }}
      >
        {/* Total Users – from API */}
        <Card
          variant="outlined"
          sx={{
            ...glassPanelSx,
            p: 2.5,
            borderRadius: 2,
            "&:hover": { boxShadow: 2 },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ p: 1, bgcolor: "rgba(15, 135, 255, 0.08)", borderRadius: 1, color: "primary.main" }}>
              <GroupIcon />
            </Box>
            <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, color: "success.main", bgcolor: "success.light", px: 1, py: 0.5, borderRadius: 1 }}>
              +12%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Total Users
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
            {loading ? (
              <Skeleton variant="text" width={80} />
            ) : (
              totalUsers !== null ? totalUsers.toLocaleString() : "—"
            )}
          </Typography>
          <Box sx={{ mt: 2, height: 6, bgcolor: isDark ? "rgba(255,255,255,0.12)" : "grey.200", borderRadius: 1, overflow: "hidden" }}>
            <Box sx={{ height: "100%", width: "75%", bgcolor: "primary.main", borderRadius: 1 }} />
          </Box>
        </Card>

        {/* Total Organization – from API */}
        <Card
          variant="outlined"
          sx={{
            ...glassPanelSx,
            p: 2.5,
            borderRadius: 2,
            "&:hover": { boxShadow: 2 },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ p: 1, bgcolor: "rgba(15, 135, 255, 0.08)", borderRadius: 1, color: "primary.main" }}>
              <CorporateFareIcon />
            </Box>
            <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, color: "success.main", bgcolor: "success.light", px: 1, py: 0.5, borderRadius: 1 }}>
              +8%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Total Organization
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
            {loading ? (
              <Skeleton variant="text" width={60} />
            ) : (
              totalOrganizations !== null ? totalOrganizations.toLocaleString() : "—"
            )}
          </Typography>
          <Box sx={{ mt: 2, height: 6, bgcolor: isDark ? "rgba(255,255,255,0.12)" : "grey.200", borderRadius: 1, overflow: "hidden" }}>
            <Box sx={{ height: "100%", width: "50%", bgcolor: "primary.main", borderRadius: 1 }} />
          </Box>
        </Card>

        {/* Monthly Revenue – Coming Soon */}
        <Card
          variant="outlined"
          sx={{
            ...glassPanelSx,
            p: 2.5,
            borderRadius: 2,
            "&:hover": { boxShadow: 2 },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ p: 1, bgcolor: "rgba(255, 193, 7, 0.15)", borderRadius: 1, color: "warning.main" }}>
              <PaymentsIcon />
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Monthly Revenue
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
            xxxxx (Coming Soon)
          </Typography>
          <Box sx={{ mt: 2, height: 6, bgcolor: isDark ? "rgba(255,255,255,0.12)" : "grey.200", borderRadius: 1, overflow: "hidden" }}>
            <Box sx={{ height: "100%", width: "0%", bgcolor: "warning.main", borderRadius: 1 }} />
          </Box>
        </Card>

        {/* System Health – from health check API, show 100% when OK */}
        <Card
          variant="outlined"
          sx={{
            ...glassPanelSx,
            p: 2.5,
            borderRadius: 2,
            "&:hover": { boxShadow: 2 },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ p: 1, bgcolor: "rgba(16, 185, 129, 0.15)", borderRadius: 1, color: "#059669" }}>
              <SpeedIcon />
            </Box>
            <Typography component="span" sx={{ fontSize: 12, fontWeight: 700, color: "success.main", bgcolor: "success.light", px: 1, py: 0.5, borderRadius: 1 }}>
              {systemHealthPercent === 100 ? "Optimal" : loading ? "…" : "Unavailable"}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            System Health
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
            {loading ? (
              <Skeleton variant="text" width={60} />
            ) : (
              systemHealthPercent !== null ? `${systemHealthPercent}%` : "—"
            )}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", gap: 0.5, alignItems: "flex-end" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 4,
                  height: 16,
                  borderRadius: 0.5,
                  bgcolor: systemHealthPercent === 100 ? (i < 6 ? "success.main" : "success.light") : "grey.400",
                }}
              />
            ))}
          </Box>
        </Card>
      </Box>

      {/* CTA card */}
      <Card
        variant="outlined"
        sx={{
          ...glassPanelSx,
          p: 4,
          borderRadius: 2,
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            bgcolor: "rgba(15, 135, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <RocketLaunchIcon sx={{ fontSize: 48, color: "primary.main", opacity: 0.7 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Ready to scale?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: "auto" }}>
          Your platform is performing exceptionally well. Monitor the real-time analytics or manage your AI model configurations to further optimize user experience.
        </Typography>
        <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{ px: 3, py: 1.25, fontWeight: 600 }}
            onClick={() => navigate("/dashboard/analytics")}
          >
            View Detailed Analytics
          </Button>
          <Button
            variant="outlined"
            sx={{ px: 3, py: 1.25, fontWeight: 600 }}
            onClick={() => navigate("/dashboard/ai-models")}
          >
            Configure AI
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
