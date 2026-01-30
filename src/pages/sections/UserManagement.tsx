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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
} from "@mui/icons-material";
import { UserService } from "@/services/user.service";
import type { User, Organization } from "@/services/user.service";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [selectedAdminFilter, setSelectedAdminFilter] = useState("");

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch users when filters or pagination changes
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchQuery, selectedOrgId, selectedTier, selectedAdminFilter]);

  const fetchOrganizations = async () => {
    try {
      const response = await UserService.getAllOrganizations();
      setOrganizations(response.data);
    } catch (err: any) {
      console.error("Error fetching organizations:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await UserService.getAllUsers({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery,
        orgId: selectedOrgId,
        tier: selectedTier,
        isSystemAdmin: selectedAdminFilter,
      });

      setUsers(response.data);
      setTotalUsers(response.pagination.totalUsers);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to fetch users");
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
    fetchUsers();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedOrgId("");
    setSelectedTier("");
    setSelectedAdminFilter("");
    setPage(0);
  };

  const getOrganizationLabel = (orgId: string) => {
    if (!orgId) return "All Organizations";
    const org = organizations.find((item) => item.org_id === orgId);
    return org?.name || "All Organizations";
  };

  const getTierLabel = (tier: string) => {
    if (!tier) return "All Tiers";
    if (tier === "FREE") return "Free";
    if (tier === "TIER1") return "Tier 1";
    if (tier === "TIER2") return "Tier 2";
    if (tier === "TIER3") return "Tier 3";
    return "All Tiers";
  };

  const getAdminStatusLabel = (value: string) => {
    if (!value) return "All Users";
    return value === "true" ? "System Admins" : "Regular Users";
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "FREE":
        return "default";
      case "TIER1":
        return "primary";
      case "TIER2":
        return "secondary";
      case "TIER3":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          User Management
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage system administrators and user accounts across all organizations.
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
            placeholder="Search by name or email..."
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

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={selectedOrgId}
                onChange={(e) => {
                  setSelectedOrgId(e.target.value);
                  setPage(0);
                }}
                displayEmpty
                renderValue={(selected) => getOrganizationLabel(selected as string)}
              >
                <MenuItem value="">All Organizations</MenuItem>
                {organizations.map((org) => (
                  <MenuItem key={org._id} value={org.org_id}>
                    {org.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedTier}
                onChange={(e) => {
                  setSelectedTier(e.target.value);
                  setPage(0);
                }}
                displayEmpty
                renderValue={(selected) => getTierLabel(selected as string)}
              >
                <MenuItem value="">All Tiers</MenuItem>
                <MenuItem value="FREE">Free</MenuItem>
                <MenuItem value="TIER1">Tier 1</MenuItem>
                <MenuItem value="TIER2">Tier 2</MenuItem>
                <MenuItem value="TIER3">Tier 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedAdminFilter}
                onChange={(e) => {
                  setSelectedAdminFilter(e.target.value);
                  setPage(0);
                }}
                displayEmpty
                renderValue={(selected) => getAdminStatusLabel(selected as string)}
              >
                <MenuItem value="">All Users</MenuItem>
                <MenuItem value="true">System Admins</MenuItem>
                <MenuItem value="false">Regular Users</MenuItem>
              </Select>
            </FormControl>

            {(searchQuery || selectedOrgId || selectedTier || selectedAdminFilter) && (
              <Tooltip title="Clear all filters">
                <IconButton onClick={handleClearFilters} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Organization</TableCell>
                <TableCell>Tier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
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
                        <Skeleton variant="text" width={150} height={24} />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={200} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={150} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={60} height={24} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Skeleton variant="rounded" width={60} height={24} />
                        <Skeleton variant="rounded" width={70} height={24} />
                      </Stack>
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" py={4}>
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={user.profile_picture_url}
                          alt={user.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          {user.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.org_id?.name || "No Organization"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.tier || "N/A"}
                        color={getTierColor(user.tier)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {user.isSystemAdmin && (
                          <Chip label="Admin" color="error" size="small" />
                        )}
                        {user.emailVerified && (
                          <Chip label="Verified" color="success" size="small" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Details">
                          <IconButton size="small" color="primary">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            color="error"
                            disabled={user.isSystemAdmin}
                          >
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
            count={totalUsers}
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
