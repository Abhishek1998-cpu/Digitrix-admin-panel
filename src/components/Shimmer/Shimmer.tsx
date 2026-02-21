import { Box, TableCell, TableRow, type SxProps, type Theme } from "@mui/material";

const shimmerKeyframes = {
  "@keyframes shimmer": {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
};

const baseShimmerSx: SxProps<Theme> = {
  ...shimmerKeyframes,
  borderRadius: 1,
  background:
    "linear-gradient(90deg, #e8e8e8 0%, #e8e8e8 40%, #f5f5f5 50%, #e8e8e8 60%, #e8e8e8 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
};

export interface ShimmerProps {
  width?: number | string;
  height?: number | string;
  variant?: "rectangular" | "text" | "circular";
  sx?: SxProps<Theme>;
}

export default function Shimmer({
  width,
  height,
  variant = "rectangular",
  sx = {},
}: ShimmerProps) {
  const isCircular = variant === "circular";
  const isText = variant === "text";
  return (
    <Box
      sx={{
        ...baseShimmerSx,
        width: width ?? (isText ? "100%" : 120),
        height: height ?? (isText ? 20 : 80),
        borderRadius: isCircular ? "50%" : 1,
        ...sx,
      }}
    />
  );
}

/** Shimmer placeholder for a table row: use inside TableBody. */
export function ShimmerTableRow({
  columns,
  rowHeight = 36,
}: {
  columns: { width?: number | string }[];
  rowHeight?: number;
}) {
  return (
    <TableRow>
      {columns.map((col, i) => (
        <TableCell key={i}>
          <Shimmer
            variant="text"
            width={col.width ?? "80%"}
            height={rowHeight}
            sx={{ borderRadius: 0.5 }}
          />
        </TableCell>
      ))}
    </TableRow>
  );
}

/** Full-width rectangular block (e.g. for card or table container loading). */
export function ShimmerBlock({ height = 200 }: { height?: number }) {
  return (
    <Box sx={{ p: 2 }}>
      <Shimmer variant="rectangular" width="100%" height={height} />
    </Box>
  );
}
