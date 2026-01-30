import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  Alert,
  Avatar,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { OrgService } from "@/services/org.service";
import type { Organization } from "@/services/org.service";

export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrgs, setTotalOrgs] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch organizations when filters or pagination changes
  useEffect(() => {
    fetchOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchQuery]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await OrgService.getAllOrganizations({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
      });

      setOrganizations(response.data);
      setTotalOrgs(response.pagination.totalOrgs);
    } catch (err: any) {
      console.error("Error fetching organizations:", err);
      setError(err.response?.data?.message || "Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchOrganizations();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPage(0);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Organization Management
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage organizations and their settings across the platform.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Search by organization name..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />

          {searchQuery && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={handleClearFilters}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Organization</TableCell>
                <TableCell>Organization ID</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Default Permission</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Skeleton loading rows
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="text" width={180} height={24} />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={120} height={24} />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Skeleton variant="text" width={150} height={20} />
                        <Skeleton variant="text" width={200} height={16} />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={90} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={80} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} height={24} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" py={4}>
                      No organizations found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <BusinessIcon />
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {org.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {org.org_id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {org.owner ? (
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight={500}>
                            {org.owner.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {org.owner.email}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No owner
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${org.memberCount || 0} members`}
                        size="small"
                        color="default"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={org.defaultPermission || "Editor"}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Organization">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Organization">
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && (
          <TablePagination
            component="div"
            count={totalOrgs}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        )}
      </Paper>
    </Box>
  );
}
