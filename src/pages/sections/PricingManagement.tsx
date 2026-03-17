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
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [limitsDraft, setLimitsDraft] = useState<{
    channels: number;
    postsPerMonth: number;
    teamMembers: number;
  } | null>(null);
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
    setLimitsDraft({ ...tier.limits });
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedTier(null);
    setLimitsDraft(null);
  };

  const handleSave = async () => {
    if (!selectedTier || !limitsDraft) return;
    try {
      setSaving(true);
      setError(null);
      await PricingService.updatePricingTier(selectedTier.tierKey, {
        limits: limitsDraft,
      });
      await fetchPricing();
      handleCloseEdit();
    } catch (err: unknown) {
      console.error("Error updating pricing tier:", err);
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to update pricing tier"
      );
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
                      <Tooltip title="Edit limits">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(tier)}
                            disabled={loading}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={editOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Tier Limits</DialogTitle>
        <DialogContent>
          {selectedTier && limitsDraft && (
            <Box mt={1}>
              <Typography variant="subtitle2" gutterBottom>
                {selectedTier.name} ({selectedTier.tierKey})
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Channels"
                    type="number"
                    fullWidth
                    value={limitsDraft.channels}
                    onChange={(e) =>
                      setLimitsDraft({
                        ...limitsDraft,
                        channels: Number(e.target.value) || 0,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Posts / month"
                    type="number"
                    fullWidth
                    value={limitsDraft.postsPerMonth}
                    onChange={(e) =>
                      setLimitsDraft({
                        ...limitsDraft,
                        postsPerMonth: Number(e.target.value) || 0,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Team members"
                    type="number"
                    fullWidth
                    value={limitsDraft.teamMembers}
                    onChange={(e) =>
                      setLimitsDraft({
                        ...limitsDraft,
                        teamMembers: Number(e.target.value) || 0,
                      })
                    }
                  />
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2, mb: 1 }} />
              <Typography variant="caption" color="text.secondary">
                Prices are managed in Stripe. Here you can only change plan limits.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
