import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Stack,
    Tooltip,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    SmartToy as RobotIcon,
} from "@mui/icons-material";

// Mock data for initial display
const initialModels = [
    { id: 1, name: "GPT-4", provider: "OpenAI", status: "Active", lastUsed: "2 mins ago" },
    { id: 2, name: "Claude 3.5 Sonnet", provider: "Anthropic", status: "Inactive", lastUsed: "1 hour ago" },
    { id: 3, name: "Gemini Pro", provider: "Google", status: "Inactive", lastUsed: "2 days ago" },
];

export default function AiModelConfiguration() {
    const [models, setModels] = useState(initialModels);

    const handleStatusChange = (modelId: number, newStatus: string) => {
        if (newStatus === "Active") {
            // If setting to active, deactivate all others
            setModels(models.map((model) => ({
                ...model,
                status: model.id === modelId ? "Active" : "Inactive",
            })));
        } else {
            // If setting to inactive, just update this one
            setModels(models.map((model) =>
                model.id === modelId ? { ...model, status: "Inactive" } : model
            ));
        }
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    AI Model Configuration
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ textTransform: "none" }}
                >
                    Add New Model
                </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" mb={3}>
                Configure and manage AI models available for content generation and other features.
            </Typography>

            <Paper elevation={1} sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="ai models table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Model Name</TableCell>
                                <TableCell>Provider</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Last Used</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {models.map((model) => (
                                <TableRow
                                    key={model.id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    hover
                                >
                                    <TableCell component="th" scope="row">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <RobotIcon color="primary" fontSize="small" />
                                            <Typography variant="body2" fontWeight={500}>
                                                {model.name}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{model.provider}</TableCell>
                                    <TableCell>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                value={model.status}
                                                onChange={(e) => handleStatusChange(model.id, e.target.value)}
                                            >
                                                <FormControlLabel
                                                    value="Active"
                                                    control={<Radio size="small" />}
                                                    label="Active"
                                                />
                                                <FormControlLabel
                                                    value="Inactive"
                                                    control={<Radio size="small" />}
                                                    label="Inactive"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>{model.lastUsed}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="Edit Configuration">
                                                <IconButton size="small" color="primary">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Configuration">
                                                <IconButton size="small" color="error">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {models.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No AI models configured.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
