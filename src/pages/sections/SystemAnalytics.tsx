import {
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import ComingSoonView, { type ComingSoonBadge } from "@/components/ComingSoonView";

const featureBadges: ComingSoonBadge[] = [
  { icon: <TimelineIcon />, label: "Real-time Tracking" },
  { icon: <PieChartIcon />, label: "Data Segmentation" },
  { icon: <DescriptionIcon />, label: "Auto Reports" },
];

export default function SystemAnalytics() {
  return (
    <ComingSoonView
      title="System Analytics"
      description="We're building powerful insights and real-time data visualization to help you manage your platform better. Stay tuned for advanced tracking and performance reports!"
      heroIcon={<BarChartIcon />}
      featureBadges={featureBadges}
      onGetNotified={() => {}}
    />
  );
}
