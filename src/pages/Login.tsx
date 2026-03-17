import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Mail,
  Lock,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { AuthService } from "@/services/auth.service";
import type { LoginRequest } from "@/services/auth.service";
import DulyPlanLogo from "@/components/DulyPlanLogo";

export default function LoginPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailType, setEmailType] = useState<"forgot-password" | "contact-admin" | null>(null);

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
      } catch (adminError: unknown) {
        // If admin check fails, user is not a system admin
        console.error("Admin check error:", adminError);
        setError("Access denied. System administrator access required.");
        await AuthService.logout();
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (err as { message?: string })?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can integrate with theme provider here if needed
  };

  const handleEmailLinkClick = (type: "forgot-password" | "contact-admin") => {
    setEmailType(type);
    setEmailDialogOpen(true);
  };

  const handleEmailDialogClose = () => {
    setEmailDialogOpen(false);
    setEmailType(null);
  };

  const handleOpenEmailClient = () => {
    const email = "info@dulyplan.com";
    let subject = "";
    let body = "";

    if (emailType === "forgot-password") {
      subject = "Password Reset Request - DulyPlan Admin Panel";
      body = `Dear DulyPlan Support Team,

I am requesting a password reset for my DulyPlan Admin Panel account.

Please assist me in resetting my password so I can regain access to my account.

Thank you for your assistance.

Best regards`;
    } else if (emailType === "contact-admin") {
      subject = "Admin Panel Access Request - DulyPlan";
      body = `Dear DulyPlan Support Team,

I need assistance accessing the DulyPlan Admin Panel.

Please help me with the following:
[Please describe your issue or request here]

Thank you for your assistance.

Best regards`;
    }

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    handleEmailDialogClose();
  };

  // Prevent page scroll - login should fit in viewport
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const originalOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = originalOverflow;
      body.style.overflow = originalBodyOverflow;
    };
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
      }}
    >
      {/* Left Panel - Marketing Content */}
      <Box
        sx={{
          width: { xs: "0%", md: "60%", lg: "65%" },
          height: { xs: 0, md: "100%" },
          minHeight: { xs: 0, md: 0 },
          flex: { md: 1 },
          position: "relative",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 0, md: 4 },
          overflow: "hidden",
          background: `linear-gradient(135deg, #1890FF 0%, #096DD9 50%, #0050B3 100%)`,
          order: { xs: 2, md: 1 },
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(1px)",
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            maxWidth: "520px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* Version Badge */}
          <Chip
            icon={<Typography sx={{ fontSize: "0.875rem" }}>✨</Typography>}
            label="Version 1.0.0 Now Available"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              fontWeight: 500,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              mb: { xs: 2, md: 2 },
              px: 2,
              py: 0.5,
            }}
          />

          {/* Main Headline */}
          <Typography
            variant="h2"
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "2rem",
                md: "2.25rem",
                lg: "2.5rem",
              },
              fontWeight: 800,
              mb: { xs: 1.5, md: 2 },
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            The ultimate dashboard for modern social strategy.
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
              fontWeight: 300,
              mb: { xs: 2, md: 2.5 },
              opacity: 0.9,
              color: "rgba(255, 255, 255, 0.9)",
              display: { xs: "none", sm: "block" },
            }}
          >
            Manage scheduled posts, analyze engagement metrics, and collaborate
            with your team in one unified environment.
          </Typography>

          {/* Dashboard Mockup - Larger */}
          <Box
            sx={{
              display: { xs: "none", lg: "block" },
              position: "relative",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: 4,
              p: 4,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              transform: "rotate(2deg)",
              transition: "transform 0.7s ease",
              maxWidth: { lg: 480, xl: 560 },
              width: "100%",
              "&:hover": {
                transform: "rotate(0deg)",
              },
            }}
          >
            {/* Window Controls */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                mb: 2.5,
                pb: 2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "rgba(239, 68, 68, 0.6)",
                }}
              />
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "rgba(234, 179, 8, 0.6)",
                }}
              />
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: "rgba(34, 197, 94, 0.6)",
                }}
              />
            </Stack>

            {/* Mock Content - Larger */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box
                sx={{
                  height: 18,
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 1.5,
                  width: "75%",
                }}
              />
              <Stack direction="row" spacing={2}>
                <Box
                  sx={{
                    height: 90,
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 2,
                    flex: 1,
                  }}
                />
                <Box
                  sx={{
                    height: 90,
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 2,
                    flex: 1,
                  }}
                />
                <Box
                  sx={{
                    height: 90,
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 2,
                    flex: 1,
                  }}
                />
              </Stack>
              <Box
                sx={{
                  height: 18,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 1.5,
                  width: "50%",
                }}
              />
              <Box
                sx={{
                  height: 110,
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Decorative Blur Circles */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: { xs: 256, md: 384 },
            height: { xs: 256, md: 384 },
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-5%",
            left: "-5%",
            width: { xs: 192, md: 288 },
            height: { xs: 192, md: 288 },
            bgcolor: "rgba(24, 144, 255, 0.2)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
      </Box>

      {/* Right Panel - Login Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "40%", lg: "35%" },
          height: { xs: "100%", md: "100%" },
          minHeight: { xs: "100vh", md: 0 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, sm: 6, md: 4, lg: 6 },
          py: { xs: 4, sm: 4, md: 3 },
          bgcolor: darkMode ? "grey.900" : "white",
          position: "relative",
          zIndex: 10,
          boxShadow: { xs: "none", md: "0 0 20px rgba(0,0,0,0.1)" },
          order: { xs: 1, md: 2 },
        }}
      >
        <Box sx={{ maxWidth: "400px", width: "100%", mx: "auto" }}>
          {/* Logo and Branding */}
          <Box sx={{ mb: { xs: 4, md: 3 } }}>
            <Box sx={{ mb: 3 }}>
              <DulyPlanLogo
                width={120}
                height={27}
                textColor={darkMode ? "white" : "black"}
              />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: darkMode ? "white" : "grey.900",
                fontSize: { xs: "1.75rem", sm: "2rem" },
              }}
            >
              Admin Panel
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: darkMode ? "grey.400" : "grey.600",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Welcome back. Please enter your credentials to manage your
              platform.
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* Email Field */}
            <Box>
              <Typography
                component="label"
                htmlFor="email"
                sx={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  mb: 1,
                  color: darkMode ? "grey.300" : "grey.700",
                }}
              >
                Email Address
              </Typography>
              <TextField
                id="email"
                type="email"
                fullWidth
                placeholder="name@company.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: darkMode ? "grey.800" : "white",
                    color: darkMode ? "white" : "grey.900",
                    "& fieldset": {
                      borderColor: darkMode ? "grey.700" : "grey.200",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "grey.600" : "grey.300",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                    "& input": {
                      color: darkMode ? "white" : "grey.900",
                      "&::placeholder": {
                        color: darkMode ? "grey.400" : "grey.500",
                        opacity: 1,
                      },
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: darkMode ? "grey.400" : "grey.600",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail sx={{ color: darkMode ? "grey.300" : "grey.400", fontSize: "1.25rem" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography
                  component="label"
                  htmlFor="password"
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: darkMode ? "grey.300" : "grey.700",
                  }}
                >
                  Password
                </Typography>
                <Link
                  component="button"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEmailLinkClick("forgot-password");
                  }}
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: 500,
                    textDecoration: "none",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
              <TextField
                id="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: darkMode ? "grey.800" : "white",
                    color: darkMode ? "white" : "grey.900",
                    "& fieldset": {
                      borderColor: darkMode ? "grey.700" : "grey.200",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "grey.600" : "grey.300",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                    },
                    "& input": {
                      color: darkMode ? "white" : "grey.900",
                      "&::placeholder": {
                        color: darkMode ? "grey.400" : "grey.500",
                        opacity: 1,
                      },
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: darkMode ? "grey.400" : "grey.600",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: darkMode ? "grey.300" : "grey.400", fontSize: "1.25rem" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: darkMode ? "grey.300" : "grey.400" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Remember Device Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: darkMode ? "grey.600" : "grey.300",
                    "&.Mui-checked": {
                      color: "primary.main",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: darkMode ? "grey.400" : "grey.600",
                  }}
                >
                  Remember this device
                </Typography>
              }
            />

            {/* Sign In Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.75,
                borderRadius: 2,
                fontSize: "0.875rem",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(24, 144, 255, 0.4)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In to Admin Panel"
              )}
            </Button>
          </Box>

          {/* Help Text */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${darkMode ? "grey.800" : "grey.100"}`,
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "0.875rem",
                color: darkMode ? "grey.400" : "grey.500",
              }}
            >
              Need help accessing your account?{" "}
              <br className={isMobile ? "block" : "hidden"} />
              <Link
                component="button"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleEmailLinkClick("contact-admin");
                }}
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Contact System Administrator
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Dark Mode Toggle */}
        <IconButton
          onClick={toggleDarkMode}
          sx={{
            position: "absolute",
            bottom: { xs: 24, md: 32 },
            left: { xs: 24, md: 64 },
            bgcolor: darkMode ? "grey.800" : "grey.100",
            color: darkMode ? "grey.300" : "grey.600",
            "&:hover": {
              bgcolor: darkMode ? "grey.700" : "grey.200",
            },
            boxShadow: 1,
          }}
        >
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Box>

      {/* Email Confirmation Dialog */}
      <Dialog
        open={emailDialogOpen}
        onClose={handleEmailDialogClose}
        aria-labelledby="email-dialog-title"
        aria-describedby="email-dialog-description"
        PaperProps={{
          sx: {
            bgcolor: darkMode ? "grey.800" : "white",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          id="email-dialog-title"
          sx={{
            color: darkMode ? "white" : "grey.900",
            fontWeight: 600,
          }}
        >
          Open Email Client
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="email-dialog-description"
            sx={{
              color: darkMode ? "grey.300" : "grey.700",
              mb: 2,
            }}
          >
            {emailType === "forgot-password"
              ? "A pre-drafted email for password reset will open in your default email client. The email will be addressed to info@dulyplan.com."
              : "A pre-drafted email for contacting the system administrator will open in your default email client. The email will be addressed to info@dulyplan.com."}
          </DialogContentText>
          <Box
            sx={{
              p: 2,
              bgcolor: darkMode ? "grey.900" : "grey.50",
              borderRadius: 1,
              border: `1px solid ${darkMode ? "grey.700" : "grey.200"}`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: darkMode ? "grey.300" : "grey.700",
                mb: 1,
              }}
            >
              Email Details:
            </Typography>
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: darkMode ? "grey.400" : "grey.600",
                mb: 0.5,
              }}
            >
              <strong>To:</strong> info@dulyplan.com
            </Typography>
            <Typography
              sx={{
                fontSize: "0.875rem",
                color: darkMode ? "grey.400" : "grey.600",
              }}
            >
              <strong>Subject:</strong>{" "}
              {emailType === "forgot-password"
                ? "Password Reset Request - DulyPlan Admin Panel"
                : "Admin Panel Access Request - DulyPlan"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleEmailDialogClose}
            sx={{
              color: darkMode ? "grey.300" : "grey.700",
              "&:hover": {
                bgcolor: darkMode ? "grey.700" : "grey.100",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOpenEmailClient}
            variant="contained"
            autoFocus
            sx={{
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Open Email Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
