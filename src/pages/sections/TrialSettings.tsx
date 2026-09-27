import { useEffect, useState } from "react";
import { Alert, Button, Paper, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { ApiService } from "@/services/api.service";
type SettingsResponse = { data: { durationDays: number } };
export default function TrialSettings() {
  const [days, setDays] = useState("");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const valid = days.trim() !== "" && Number.isInteger(Number(days)) && Number(days) >= 1 && Number(days) <= 365;
  const load = async () => {
    setLoading(true); setError("");
    try {
      const result = await ApiService.get<SettingsResponse>("/v1/system-admin/trial-settings");
      setDays(String(result.data.durationDays)); setSaved(String(result.data.durationDays));
    } catch { setError("Unable to load trial settings. Please retry."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const save = async () => {
    if (!valid) return;
    setSaving(true); setError(""); setSuccess(false);
    try {
      const result = await ApiService.put<SettingsResponse>("/v1/system-admin/trial-settings", { durationDays: Number(days) });
      setDays(String(result.data.durationDays)); setSaved(String(result.data.durationDays)); setSuccess(true);
    } catch { setError("Unable to save trial duration. Please try again."); }
    finally { setSaving(false); }
  };
  return <Paper sx={{ p: 3, mb: 3 }}>
    <Stack spacing={2}>
      <Typography variant="h6">Free trial duration</Typography>
      <Typography variant="body2" color="text.secondary">Applies to newly created organizations. Existing trial end dates and paid plans stay unchanged. Trial includes 2 channels, 10 total posts, and 1 team member.</Typography>
      {error && <Alert severity="error" action={!saved ? <Button onClick={load}>Retry</Button> : undefined}>{error}</Alert>}
      {success && <Alert severity="success" onClose={() => setSuccess(false)}>Trial duration saved for new organizations.</Alert>}
      {loading ? <Skeleton height={56} /> : saved && <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
        <TextField label="Trial duration (days)" type="number" value={days} disabled={saving} inputProps={{ min: 1, max: 365, step: 1 }} error={!valid} helperText="1–365 whole days" onChange={e => { setDays(e.target.value); setSuccess(false); }} />
        <Button variant="contained" disabled={saving || !valid || days === saved} onClick={save}>{saving ? "Saving..." : "Save duration"}</Button>
      </Stack>}
    </Stack>
  </Paper>;
}
