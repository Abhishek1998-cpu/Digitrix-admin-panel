import {
  Flag as FlagIcon,
  Timeline as TimelineIcon,
  Science as ScienceIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
} from "@mui/icons-material";
import ComingSoonView, { type ComingSoonBadge } from "@/components/ComingSoonView";

const featureBadges: ComingSoonBadge[] = [
  { icon: <TimelineIcon />, label: "Gradual Rollout" },
  { icon: <ScienceIcon />, label: "A/B Testing" },
  { icon: <PowerSettingsNewIcon />, label: "Kill Switch" },
];

export default function FeatureFlags() {
  return (
    <ComingSoonView
      title="Feature Flags"
      description="We're building a powerful feature flag system to control the rollout of new features across your platform. Stay tuned for gradual releases, A/B testing, and instant kill switches!"
      heroIcon={<FlagIcon />}
      featureBadges={featureBadges}
      onGetNotified={() => {}}
    />
  );
}
