import { Box, Typography, Paper } from "@mui/material";

export default function FeatureFlags() {
  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: { xs: 2, sm: 3 },
            fontWeight: 700,
          }}
        >
          Feature Flags
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
          }}
        >
          Manage feature flags to control the rollout of new features across the platform.
        </Typography>
      </Paper>
    </Box>
  );
}
