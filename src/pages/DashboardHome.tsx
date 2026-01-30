import {
  Box,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

interface DashboardHomeProps {
  isSystemAdmin: boolean;
}

export default function DashboardHome({ isSystemAdmin }: DashboardHomeProps) {
  return (
    <Box>
      {isSystemAdmin && (
        <Alert severity="success" sx={{ mb: 3 }}>
          You have system administrator access.
        </Alert>
      )}

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
          Admin Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: { xs: 2, sm: 3 },
          }}
        >
          Welcome to the DulyPlan Admin Panel. Use the sidebar to navigate between different management sections.
        </Typography>
      </Paper>
    </Box>
  );
}
