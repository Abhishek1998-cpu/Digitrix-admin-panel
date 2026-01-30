import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { AuthService } from "@/services/auth.service";
import type { LoginRequest } from "@/services/auth.service";

export default function LoginPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Login
      const response = await AuthService.login(data);

      // Check if login was successful (backend returns user object on success)
      if (!response.user) {
        setError(response.message || "Login failed. Please try again.");
        return;
      }

      // Step 2: Check if user is a system admin
      try {
        const adminStatus = await AuthService.checkSystemAdminStatus();
        
        if (adminStatus.isSystemAdmin) {
          // Success - redirect to dashboard
          navigate("/dashboard", { replace: true });
        } else {
          // User is not a system admin
          setError("Access denied. System administrator access required.");
          await AuthService.logout();
        }
      } catch (adminError: any) {
        // If admin check fails, user is not a system admin
        console.error("Admin check error:", adminError);
        setError("Access denied. System administrator access required.");
        await AuthService.logout();
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (theme) => theme.palette.grey[100],
        px: { xs: 2, sm: 3, md: 0 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          width: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3 },
            borderRadius: 2,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            sx={{
              fontWeight: 700,
              textAlign: "center",
              mb: { xs: 1, sm: 0 },
            }}
          >
            DulyPlan Admin Panel
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "text.secondary",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Sign in to access the admin dashboard
          </Typography>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mt: { xs: 1, sm: 0 } }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 2.5 },
              mt: { xs: 2, sm: 3 },
            }}
          >
            <TextField
              label="Email"
              type="email"
              fullWidth
              size={isMobile ? "medium" : "medium"}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              size={isMobile ? "medium" : "medium"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size={isMobile ? "medium" : "large"}
              disabled={loading}
              sx={{
                mt: { xs: 1, sm: 2 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
