import { Box, Typography, Paper } from "@mui/material";

export default function SystemAnalytics() {
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
          System Analytics
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
          }}
        >
          View system-wide analytics, usage statistics, and performance metrics.
        </Typography>
      </Paper>
    </Box>
  );
}
