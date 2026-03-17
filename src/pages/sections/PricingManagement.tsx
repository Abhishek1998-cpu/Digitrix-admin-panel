import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import { ShimmerTableRow } from "@/components/Shimmer/Shimmer";
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { PricingService } from "@/services/pricing.service";
import type { PricingTier } from "@/services/pricing.service";

export default function PricingManagement() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    monthly: 0,
    yearly: 0,
    channels: 0,
    postsPerMonth: 0,
    teamMembers: 0,
    stripeMonthly: "",
    stripeYearly: "",
    isActive: true,
    features: {
      basicScheduling: true,
      basicAnalytics: false,
      advancedAnalytics: false,
      prioritySupport: false,
      customBranding: false,
    },
  });

  const currency = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PricingService.getPricingTiers();
      setTiers(response.data);
    } catch (err: unknown) {
      console.error("Error fetching pricing tiers:", err);
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to fetch pricing tiers");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (tier: PricingTier) => {
    setSelectedTier(tier);
    setFormState({
      name: tier.name,
      monthly: tier.price.monthly,
      yearly: tier.price.yearly,
      channels: tier.limits.channels,
      postsPerMonth: tier.limits.postsPerMonth,
      teamMembers: tier.limits.teamMembers,
      stripeMonthly: tier.stripePriceId.monthly || "",
      stripeYearly: tier.stripePriceId.yearly || "",
      isActive: tier.isActive,
      features: {
        basicScheduling: tier.features.basicScheduling,
        basicAnalytics: tier.features.basicAnalytics,
        advancedAnalytics: tier.features.advancedAnalytics,
        prioritySupport: tier.features.prioritySupport,
        customBranding: tier.features.customBranding,
      },
    });
  };

  const handleCloseEdit = () => {
    setSelectedTier(null);
  };

  const handleSave = async () => {
    if (!selectedTier) return;
    try {
      setSaving(true);
      await PricingService.updatePricingTier(selectedTier.tierKey, {
        name: formState.name,
        price: { monthly: formState.monthly, yearly: formState.yearly },
        limits: {
          channels: formState.channels,
          postsPerMonth: formState.postsPerMonth,
          teamMembers: formState.teamMembers,
        },
        stripePriceId: {
          monthly: formState.stripeMonthly || null,
          yearly: formState.stripeYearly || null,
        },
        isActive: formState.isActive,
        features: formState.features,
      });
      await fetchPricing();
      handleCloseEdit();
    } catch (err: unknown) {
      console.error("Error updating pricing tier:", err);
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update pricing tier");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Pricing Management
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchPricing} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage subscription plans, pricing tiers, and billing settings.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tier</TableCell>
                <TableCell>Monthly</TableCell>
                <TableCell>Yearly</TableCell>
                <TableCell>Limits</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <ShimmerTableRow
                    key={`pricing-shimmer-${index}`}
                    columns={[{}, {}, {}, {}, {}, {}]}
                    rowHeight={24}
                  />
                ))
              ) : tiers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" py={4}>
                      No pricing tiers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tiers.map((tier) => (
                  <TableRow key={tier._id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight={600}>
                          {tier.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tier.tierKey}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{currency.format(tier.price.monthly)}</TableCell>
                    <TableCell>{currency.format(tier.price.yearly)}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Channels: {tier.limits.channels}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Posts: {tier.limits.postsPerMonth}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Team: {tier.limits.teamMembers}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tier.isActive ? "Active" : "Inactive"}
                        color={tier.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit pricing">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(tier)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={!!selectedTier} onClose={handleCloseEdit} maxWidth="md" fullWidth>
        <DialogTitle>Edit Pricing Tier</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              label="Tier Name"
              fullWidth
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Monthly Price"
                  type="number"
                  fullWidth
                  value={formState.monthly}
                  onChange={(e) => setFormState({ ...formState, monthly: Number(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Yearly Price"
                  type="number"
                  fullWidth
                  value={formState.yearly}
                  onChange={(e) => setFormState({ ...formState, yearly: Number(e.target.value) })}
                />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle1" fontWeight={600}>
              Limits
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Channels"
                  type="number"
                  fullWidth
                  value={formState.channels}
                  onChange={(e) =>
                    setFormState({ ...formState, channels: Number(e.target.value) })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Posts / Month"
                  type="number"
                  fullWidth
                  value={formState.postsPerMonth}
                  onChange={(e) =>
                    setFormState({ ...formState, postsPerMonth: Number(e.target.value) })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Team Members"
                  type="number"
                  fullWidth
                  value={formState.teamMembers}
                  onChange={(e) =>
                    setFormState({ ...formState, teamMembers: Number(e.target.value) })
                  }
                />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle1" fontWeight={600}>
              Stripe Price IDs
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Monthly Price ID"
                  fullWidth
                  value={formState.stripeMonthly}
                  onChange={(e) => setFormState({ ...formState, stripeMonthly: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Yearly Price ID"
                  fullWidth
                  value={formState.stripeYearly}
                  onChange={(e) => setFormState({ ...formState, stripeYearly: e.target.value })}
                />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle1" fontWeight={600}>
              Features
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(formState.features).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            features: { ...formState.features, [key]: e.target.checked },
                          })
                        }
                      />
                    }
                    label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  />
                </Grid>
              ))}
            </Grid>

            <FormControlLabel
              control={
                <Switch
                  checked={formState.isActive}
                  onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
