import { useState, useEffect } from "react";
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
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    SmartToy as RobotIcon,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { AiService } from "@/services/ai.service";
import type { AIModel } from "@/services/ai.service";

export default function AiModelConfiguration() {
    const [models, setModels] = useState<AIModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit Dialog State
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingModel, setEditingModel] = useState<Partial<AIModel>>({});
    const [saving, setSaving] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    // Add Dialog State
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newModel, setNewModel] = useState({
        model: "",
        provider: "",
        apiKey: "",
        isActive: false
    });
    // Delete Dialog State
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deletingModel, setDeletingModel] = useState<AIModel | null>(null);

    console.log("Render: AiModelConfiguration", { loading, modelsCount: models.length, models });

    useEffect(() => {
        const fetchModels = async () => {
            try {
                setLoading(true);
                const response = await AiService.getAiModels() as any;
                console.log("AI Models API Response (Raw):", response);

                let dataToProcess: any[] = [];

                // DATA EXTRACTION HEURISTICS
                if (Array.isArray(response)) {
                    // Case 1: Root is array [...]
                    console.log("Detected array at root");
                    dataToProcess = response;
                } else if (response && Array.isArray(response.data)) {
                    // Case 2: { data: [...] } (Standard envelope)
                    console.log("Detected array at response.data");
                    dataToProcess = response.data;
                } else if (response && response.data && Array.isArray(response.data.data)) {
                    // Case 3: { data: { data: [...] } } (Double envelope)
                    console.log("Detected array at response.data.data");
                    dataToProcess = response.data.data;
                } else if (response && response.models && Array.isArray(response.models)) {
                    // Case 4: { models: [...] }
                    console.log("Detected array at response.models");
                    dataToProcess = response.models;
                } else if (response && typeof response === 'object' && (response._id || response.model)) {
                    // Case 5: Single object returned instead of array
                    console.log("Detected single object at root");
                    dataToProcess = [response];
                }

                console.log("Processed Data Count:", dataToProcess.length);
                console.log("Processed Data Sample:", dataToProcess[0]);

                if (dataToProcess.length > 0) {
                    setModels(dataToProcess.map((item: any) => {
                        // Derive provider from model name
                        let derivedProvider = "Unknown";
                        const modelLower = (item.model || item.name || "").toLowerCase();
                        if (modelLower.includes("gpt")) derivedProvider = "OpenAI";
                        else if (modelLower.includes("claude")) derivedProvider = "Anthropic";
                        else if (modelLower.includes("gemini")) derivedProvider = "Google";
                        else if (modelLower.includes("llama")) derivedProvider = "Meta";
                        else if (modelLower.includes("mistral")) derivedProvider = "Mistral";
                        // Use provider from item if available
                        if (item.provider) derivedProvider = item.provider;

                        return {
                            ...item,
                            id: item._id, // Use _id as primary key
                            name: item.model || item.name || "Unknown Model",
                            provider: derivedProvider,
                            status: item.isActive ? "Active" : "Inactive",
                            isActive: item.isActive,
                            lastUsed: item.lastUsed || "N/A",
                        };
                    }));
                } else {
                    console.warn("No valid data array found in response structure.");
                    setModels([]);
                }
            } catch (err) {
                console.error("Failed to fetch AI models", err);
                setError("Failed to load AI configuration.");
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    const handleStatusChange = async (modelId: string | number, newStatus: string) => {
        const isNowActive = newStatus === "Active";

        // Optimistic UI Update
        const previousModels = [...models];

        if (isNowActive) {
            // Optimistically update UI
            // Note: If backend enforces mutual exclusivity, we just need to update the one we want active.
            // If we need to explicitly deactivate others in frontend first, we do that here for visual feedback.
            setModels(models.map((model) => ({
                ...model,
                isActive: (model._id === modelId || model.id === modelId),
                status: (model._id === modelId || model.id === modelId) ? "Active" : "Inactive",
            })));

            try {
                // Find the model object to update
                const modelToUpdate = models.find(m => m._id === modelId || m.id === modelId);
                if (modelToUpdate) {
                    // Send update request for the target model
                    // We send the ID and the new isActive status
                    await AiService.updateAiConfig({
                        _id: typeof modelId === 'string' ? modelId : String(modelId),
                        isActive: true
                    });
                }
            } catch (err) {
                console.error("Failed to set active model", err);
                setError("Failed to update active model. Please try again.");
                // Revert on failure
                setModels(previousModels);
            }
        }
    };

    const handleEditClick = (model: AIModel) => {
        setEditingModel({
            ...model,
            // Ensure api_key is available for editing, mapping it if it's not strictly on the surface object
            api_key: model.api_key || ""
        });
        setOpenEditDialog(true);
        setShowApiKey(false); // Reset visibility on open
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingModel({});
        setShowApiKey(false);
    };

    const handleSaveEdit = async () => {
        if (!editingModel._id) return;

        try {
            setSaving(true);
            await AiService.updateAiConfig({
                _id: editingModel._id,
                model: editingModel.model || editingModel.name, // Support both fields
                api_key: editingModel.api_key
            });

            // Update local state
            setModels(models.map(m =>
                m._id === editingModel._id
                    ? { ...m, ...editingModel, name: editingModel.model || editingModel.name || m.name }
                    : m
            ));

            setOpenEditDialog(false);
        } catch (err) {
            console.error("Failed to update model configuration", err);
            setError("Failed to update configuration.");
        } finally {
            setSaving(false);
        }
    };

    // Add New Model Handlers
    const handleAddClick = () => {
        setNewModel({
            model: "",
            provider: "",
            apiKey: "",
            isActive: false
        });
        setOpenAddDialog(true);
        setShowApiKey(false);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setShowApiKey(false);
    };

    const handleCreateNewModel = async () => {
        if (!newModel.model || !newModel.apiKey || !newModel.provider) {
            // Ideally show validation error
            setError("Model Name, Provider, and API Key are required.");
            return;
        }

        try {
            setSaving(true);
            const payload = {
                model: newModel.model,
                apiKey: newModel.apiKey,
                provider: newModel.provider,
                isActive: newModel.isActive
            };

            // Response might contain the created model with _id
            const response = await AiService.createAiConfig(payload);

            // Optimistically add to list (re-fetch would be safer but this gives instant feedback)
            // If response contains data we use it
            const createdModelData = response.data || response || {};

            const newModelEntry: AIModel = {
                _id: createdModelData._id || `temp-${Date.now()}`,
                model: newModel.model,
                provider: newModel.provider,
                isActive: newModel.isActive,
                name: newModel.model,
                status: (newModel.isActive ? "Active" : "Inactive") as "Active" | "Inactive",
                lastUsed: "Never",
                api_key: newModel.apiKey // Mapping for internal consistency if needed
            };

            // If new model is active, we might need to deactivate others locally
            if (newModel.isActive) {
                setModels(prev => [
                    ...prev.map(m => ({ ...m, isActive: false, status: "Inactive" as "Active" | "Inactive" })),
                    newModelEntry
                ]);
            } else {
                setModels(prev => [...prev, newModelEntry]);
            }

            setOpenAddDialog(false);
            setError(null); // Clear any previous errors
        } catch (err) {
            console.error("Failed to create new model", err);
            setError("Failed to create new model.");
        } finally {
            setSaving(false);
        }
    };

    // Delete Handlers
    const handleDeleteClick = (model: AIModel) => {
        setDeletingModel(model);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setDeletingModel(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingModel?._id) return;

        try {
            setSaving(true);
            await AiService.deleteAiConfig(deletingModel._id);
            setModels(models.filter((m) => m._id !== deletingModel._id));
            setOpenDeleteDialog(false);
            setDeletingModel(null);
        } catch (err) {
            console.error("Failed to delete model", err);
            setError("Failed to delete model.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

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
                    onClick={handleAddClick}
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
                                    key={model._id || model.id}
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
                                                onChange={(e) => handleStatusChange(model._id || model.id!, e.target.value)}
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
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEditClick(model)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Configuration">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteClick(model)}
                                                >
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

                {/* Edit Dialog */}
                <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit AI Model</DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                label="Model Name"
                                fullWidth
                                value={editingModel.model || editingModel.name || ""}
                                onChange={(e) => setEditingModel({ ...editingModel, model: e.target.value, name: e.target.value })}
                                helperText="e.g. gpt-4, claude-3-opus"
                            />
                            <TextField
                                label="API Key"
                                fullWidth
                                type={showApiKey ? "text" : "password"}
                                value={editingModel.api_key || ""}
                                onChange={(e) => setEditingModel({ ...editingModel, api_key: e.target.value })}
                                placeholder="sk-..."
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowApiKey(!showApiKey)}
                                                onMouseDown={(e) => e.preventDefault()}
                                                edge="end"
                                            >
                                                {showApiKey ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditDialog} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            variant="contained"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Add New Model Dialog */}
                <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Add New AI Model</DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                label="Model Name"
                                fullWidth
                                value={newModel.model}
                                onChange={(e) => setNewModel({ ...newModel, model: e.target.value })}
                                helperText="e.g. gpt-4o, claude-3-opus"
                                required
                            />
                            <TextField
                                label="Provider"
                                fullWidth
                                value={newModel.provider}
                                onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
                                placeholder="openai, anthropic"
                                required
                            />
                            <TextField
                                label="API Key"
                                fullWidth
                                type={showApiKey ? "text" : "password"}
                                value={newModel.apiKey}
                                onChange={(e) => setNewModel({ ...newModel, apiKey: e.target.value })}
                                placeholder="sk-..."
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowApiKey(!showApiKey)}
                                                onMouseDown={(e) => e.preventDefault()}
                                                edge="end"
                                            >
                                                {showApiKey ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl component="fieldset">
                                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                    Is Active Status
                                </Typography>
                                <RadioGroup
                                    row
                                    value={newModel.isActive ? "true" : "false"}
                                    onChange={(e) => setNewModel({ ...newModel, isActive: e.target.value === "true" })}
                                >
                                    <FormControlLabel value="true" control={<Radio />} label="True" />
                                    <FormControlLabel value="false" control={<Radio />} label="False" />
                                </RadioGroup>
                            </FormControl>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddDialog} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateNewModel}
                            variant="contained"
                            disabled={saving}
                        >
                            {saving ? "Creating..." : "Create Model"}
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* Delete Confirmation Dialog */}
                <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Delete AI Model?</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete the configuration for <strong>{deletingModel?.name}</strong>?
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            color="error"
                            variant="contained"
                            disabled={saving}
                            autoFocus
                        >
                            {saving ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
}
