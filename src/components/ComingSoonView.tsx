import { Box, Typography, Button, useTheme, keyframes } from "@mui/material";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const ping = keyframes`
  75%, 100% { transform: scale(2); opacity: 0; }
`;

export interface ComingSoonBadge {
  icon: ReactNode;
  label: string;
}

interface ComingSoonViewProps {
  title: string;
  description: string;
  heroIcon: ReactNode;
  featureBadges: ComingSoonBadge[];
  onGetNotified?: () => void;
}

export default function ComingSoonView({
  title,
  description,
  heroIcon,
  featureBadges,
  onGetNotified,
}: ComingSoonViewProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const meshGradientSx = {
    background: isDark ? "#0a0c10" : "#f0f7ff",
    backgroundImage: isDark
      ? `
        radial-gradient(at 0% 0%, rgba(15, 135, 255, 0.08) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(15, 135, 255, 0.05) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(15, 135, 255, 0.08) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(15, 135, 255, 0.05) 0px, transparent 50%);
      `
      : `
        radial-gradient(at 0% 0%, rgba(15, 135, 255, 0.05) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(15, 135, 255, 0.08) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(15, 135, 255, 0.03) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(15, 135, 255, 0.05) 0px, transparent 50%);
      `,
  };

  const glassCardSx = {
    background: isDark ? "rgba(15, 20, 28, 0.7)" : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: isDark
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(255, 255, 255, 0.4)",
    boxShadow: isDark
      ? "0 8px 32px 0 rgba(0, 0, 0, 0.5)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  };

  return (
    <Box
      sx={{
        ...meshGradientSx,
        margin: { xs: -2, sm: -3 },
        padding: { xs: 2, sm: 3 },
        flex: 1,
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        pb: 8,
      }}
    >
      {/* Abstract background blurs */}
      <Box
        sx={{
          position: "absolute",
          top: "25%",
          left: "25%",
          width: 384,
          height: 384,
          bgcolor: "primary.main",
          opacity: 0.1,
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "25%",
          right: "25%",
          width: 320,
          height: 320,
          bgcolor: "primary.main",
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Central glass card */}
      <Box
        sx={{
          ...glassCardSx,
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 672,
          borderRadius: 3,
          p: { xs: 3, sm: 4, md: 6 },
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Hero icon with glow */}
        <Box sx={{ position: "relative", mb: 4 }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "primary.main",
              opacity: 0.2,
              filter: "blur(24px)",
              borderRadius: "50%",
              transform: "scale(1.5)",
            }}
          />
          <Box
            sx={{
              position: "relative",
              width: 96,
              height: 96,
              bgcolor: isDark ? "rgba(15, 20, 28, 0.9)" : "white",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.3)" : 3,
              border: "1px solid",
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "primary.main",
              color: "primary.main",
              "& .MuiSvgIcon-root": { fontSize: 48 },
            }}
          >
            {heroIcon}
          </Box>
        </Box>

        {/* Coming Soon badge with ping */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: "9999px",
            bgcolor: isDark ? "rgba(15, 135, 255, 0.15)" : "rgba(15, 135, 255, 0.1)",
            border: "1px solid",
            borderColor: isDark ? "rgba(15, 135, 255, 0.3)" : "rgba(15, 135, 255, 0.2)",
            color: "primary.main",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            mb: 3,
          }}
        >
          <Box sx={{ position: "relative", width: 8, height: 8 }}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                bgcolor: "primary.main",
                opacity: 0.75,
                animation: `${ping} 1.5s cubic-bezier(0, 0, 0.2, 1) infinite`,
              }}
            />
            <Box
              sx={{
                position: "relative",
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "primary.main",
              }}
            />
          </Box>
          Coming Soon
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.875rem", sm: "2.25rem", md: "3rem" },
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "text.primary",
            mb: 2,
          }}
        >
          {title} is{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            on its way.
          </Box>
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            color: "text.secondary",
            maxWidth: 480,
            mx: "auto",
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 2,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            startIcon={<NotificationsActiveIcon />}
            onClick={onGetNotified}
            sx={{
              minWidth: 180,
              py: 1.75,
              px: 3,
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: "0 10px 15px -3px rgba(15, 135, 255, 0.25)",
            }}
          >
            Get Notified
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard")}
            sx={{
              minWidth: 180,
              py: 1.75,
              px: 3,
              fontWeight: 700,
              borderRadius: 2,
              borderColor: isDark ? "rgba(255, 255, 255, 0.15)" : "grey.300",
              color: "text.primary",
              "&:hover": {
                borderColor: isDark ? "rgba(255, 255, 255, 0.3)" : "grey.400",
                bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "grey.50",
              },
            }}
          >
            Return to Dashboard
          </Button>
        </Box>

        {/* Feature teaser badges */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "grey.200",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1.5,
            width: "100%",
          }}
        >
          {featureBadges.map((badge) => (
            <Box
              key={badge.label}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                bgcolor: isDark ? "rgba(255, 255, 255, 0.06)" : "grey.100",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "none",
                color: "text.secondary",
                fontSize: "0.875rem",
                fontWeight: 500,
                "& .MuiSvgIcon-root": { fontSize: 20 },
              }}
            >
              {badge.icon}
              {badge.label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
