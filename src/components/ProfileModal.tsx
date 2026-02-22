import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import type { ReactNode } from "react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export default function ProfileModal({ open, onClose, user }: ProfileModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!user || !user.userinfo) {
    return null;
  }

  const userInfo = user.userinfo;
  const createdAt = userInfo.createdAt
    ? new Date(userInfo.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const updatedAt = userInfo.updatedAt
    ? new Date(userInfo.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: ReactNode;
    label: string;
    value: string | null | undefined;
  }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        py: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          minWidth: "40px",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontSize: "0.75rem",
            fontWeight: 600,
            display: "block",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            wordBreak: "break-word",
          }}
        >
          {value || "Not provided"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          backgroundColor: theme.palette.background.paper,
          border: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : undefined,
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: { xs: 48, sm: 64 },
              height: { xs: 48, sm: 64 },
              bgcolor: "primary.main",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
            src={userInfo.profile_picture_url || undefined}
          >
            {userInfo.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{ fontWeight: 700, mb: 0.5 }}
            >
              {userInfo.name || "User"}
            </Typography>
            {userInfo.isSystemAdmin && (
              <Chip
                label="System Administrator"
                color="primary"
                size="small"
                icon={<CheckCircleIcon />}
                sx={{ mt: 0.5 }}
              />
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 3, sm: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            mb: 3,
            border: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: "text.primary",
            }}
          >
            Personal Information
          </Typography>

          <InfoRow
            icon={<EmailIcon fontSize="small" />}
            label="Email Address"
            value={userInfo.email}
          />

          <InfoRow
            icon={<PersonIcon fontSize="small" />}
            label="Full Name"
            value={userInfo.name}
          />

          {userInfo.userMeta?.bio && (
            <InfoRow
              icon={<PersonIcon fontSize="small" />}
              label="Bio"
              value={userInfo.userMeta.bio}
            />
          )}

          {userInfo.userMeta?.company && (
            <InfoRow
              icon={<PersonIcon fontSize="small" />}
              label="Company"
              value={userInfo.userMeta.company}
            />
          )}

          {userInfo.userMeta?.jobTitle && (
            <InfoRow
              icon={<PersonIcon fontSize="small" />}
              label="Job Title"
              value={userInfo.userMeta.jobTitle}
            />
          )}

          {userInfo.userMeta?.timezone && (
            <InfoRow
              icon={<CalendarIcon fontSize="small" />}
              label="Time Zone"
              value={userInfo.userMeta.timezone}
            />
          )}
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            backgroundColor: theme.palette.background.paper,
            borderRadius: 2,
            mb: 3,
            border: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: "text.primary",
            }}
          >
            Account Information
          </Typography>

          <InfoRow
            icon={<CalendarIcon fontSize="small" />}
            label="Account Created"
            value={createdAt}
          />

          <InfoRow
            icon={<CalendarIcon fontSize="small" />}
            label="Last Updated"
            value={updatedAt}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 2,
              py: 1.5,
            }}
          >
            <Box
              sx={{
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                minWidth: "40px",
              }}
            >
              <CheckCircleIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  display: "block",
                  mb: 0.5,
                }}
              >
                Email Verification Status
              </Typography>
              <Chip
                label={userInfo.emailVerified ? "Verified" : "Not Verified"}
                color={userInfo.emailVerified ? "success" : "warning"}
                size="small"
                icon={userInfo.emailVerified ? <CheckCircleIcon /> : undefined}
              />
            </Box>
          </Box>
        </Paper>

        {userInfo.userMeta?.socialLinks &&
          (userInfo.userMeta.socialLinks.x ||
            userInfo.userMeta.socialLinks.facebook ||
            userInfo.userMeta.socialLinks.linkedin) && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                border: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "text.primary",
                }}
              >
                Social Links
              </Typography>

              {userInfo.userMeta.socialLinks.x && (
                <InfoRow
                  icon={<PersonIcon fontSize="small" />}
                  label="X (Twitter)"
                  value={userInfo.userMeta.socialLinks.x}
                />
              )}

              {userInfo.userMeta.socialLinks.facebook && (
                <InfoRow
                  icon={<PersonIcon fontSize="small" />}
                  label="Facebook"
                  value={userInfo.userMeta.socialLinks.facebook}
                />
              )}

              {userInfo.userMeta.socialLinks.linkedin && (
                <InfoRow
                  icon={<PersonIcon fontSize="small" />}
                  label="LinkedIn"
                  value={userInfo.userMeta.socialLinks.linkedin}
                />
              )}
            </Paper>
          )}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          fullWidth={isMobile}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
