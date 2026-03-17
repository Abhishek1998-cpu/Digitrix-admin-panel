import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Tooltip,
  Link,
} from "@mui/material";
import { ShimmerBlock } from "@/components/Shimmer/Shimmer";
import {
  Refresh as RefreshIcon,
  Link as LinkIcon,
  Token as TokenIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import {
  IntegrationsService,
  type Integration,
  type ChannelSummary,
} from "@/services/integrations.service";

function DeveloperAppsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await IntegrationsService.getIntegrations();
      setIntegrations(res.integrations || []);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to fetch integrations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading) {
    return <ShimmerBlock height={280} />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Status of developer app credentials (env). Use redirect URIs in each platform&apos;s console.
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetch} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Platform</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>App / Client ID (masked)</TableCell>
              <TableCell>Secret set</TableCell>
              <TableCell>Redirect URI</TableCell>
              <TableCell>Docs / Console</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {integrations.map((row) => (
              <TableRow key={row.platform}>
                <TableCell sx={{ textTransform: "capitalize" }}>{row.platform}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status === "configured" ? "Configured" : "Not configured"}
                    color={row.status === "configured" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                    {row.appIdMasked ?? "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {row.status === "configured" ? (
                    <Chip
                      label={row.hasSecret ? "Yes" : "No"}
                      size="small"
                      color={row.hasSecret ? "success" : "warning"}
                      variant="outlined"
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                    {row.redirectUri || "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {row.docsLink ? (
                    <Link
                      href={row.docsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                    >
                      Open <OpenInNewIcon sx={{ fontSize: 14 }} />
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function TokenHealthTab() {
  const [channels, setChannels] = useState<ChannelSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string | number> = {};
      if (platformFilter) params.platform = platformFilter;
      if (statusFilter === "expired") params.expired = "true";
      if (statusFilter === "expiring_soon") params.expiringWithin = 7;
      const res = await IntegrationsService.getChannels(params);
      setChannels(res.channels || []);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to fetch channels");
    } finally {
      setLoading(false);
    }
  }, [platformFilter, statusFilter]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  if (loading) {
    return <ShimmerBlock height={280} />;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Platform</InputLabel>
          <Select
            value={platformFilter}
            label="Platform"
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="instagram">Instagram</MenuItem>
            <MenuItem value="facebook">Facebook</MenuItem>
            <MenuItem value="linkedin">LinkedIn</MenuItem>
            <MenuItem value="x">X (Twitter)</MenuItem>
            <MenuItem value="tiktok">TikTok</MenuItem>
            <MenuItem value="youtube">YouTube</MenuItem>
            <MenuItem value="pinterest">Pinterest</MenuItem>
            <MenuItem value="threads">Threads</MenuItem>
            <MenuItem value="telegram">Telegram</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Token status</InputLabel>
          <Select
            value={statusFilter}
            label="Token status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
            <MenuItem value="expiring_soon">Expiring in 7 days</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Refresh">
          <IconButton onClick={fetch} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Platform</TableCell>
              <TableCell>Account</TableCell>
              <TableCell>Org ID</TableCell>
              <TableCell>Expires at</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Connected</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {channels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No channels found.
                </TableCell>
              </TableRow>
            ) : (
              channels.map((row) => (
                <TableRow key={row._id}>
                  <TableCell sx={{ textTransform: "capitalize" }}>{row.platform}</TableCell>
                  <TableCell>{row.account_name || row.profile?.username || "—"}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                    {row.org_id}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem" }}>{formatDate(row.expires_at)}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        row.tokenStatus === "expired"
                          ? "Expired"
                          : row.tokenStatus === "expires_soon"
                            ? "Expires soon"
                            : "OK"
                      }
                      color={
                        row.tokenStatus === "expired"
                          ? "error"
                          : row.tokenStatus === "expires_soon"
                            ? "warning"
                            : "success"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem" }}>
                    {row.createdAt ? formatDate(row.createdAt) : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function IntegrationsManagement() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Integrations & Token Health
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Developer app status per platform and connected channel token expiry. No secrets are shown.
      </Typography>
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: 1, borderColor: "divider", px: 1 }}
        >
          <Tab icon={<LinkIcon />} iconPosition="start" label="Developer apps" />
          <Tab icon={<TokenIcon />} iconPosition="start" label="Token health (channels)" />
        </Tabs>
        {tab === 0 && <DeveloperAppsTab />}
        {tab === 1 && <TokenHealthTab />}
      </Paper>
    </Box>
  );
}
