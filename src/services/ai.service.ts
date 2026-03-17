import { ApiService } from "./api.service";

export interface AIModel {
    _id: string;
    model: string; // The specific model identifier, e.g., "gpt-4.1"
    api_key?: string; // API key (handle with care)
    isActive: boolean;
    // UI helpers / Derived fields
    id?: string;
    name?: string;
    provider?: string;
    status?: "Active" | "Inactive";
    lastUsed?: string;
}

export interface GetAiModelsResponse {
    success: boolean;
    data: AIModel[];
}

export const AiService = {
    /**
     * Get all configured AI models
     */
    getAiModels: (): Promise<GetAiModelsResponse> => {
        return ApiService.get("/v1/admin/ai-config");
    },

    /**
     * Update an AI configuration (used for setting active status or editing)
     */
    updateAiConfig: (data: Partial<AIModel>): Promise<{ success?: boolean; data?: AIModel }> => {
        return ApiService.put("/v1/admin/ai-config", data);
    },

    /**
     * Create a new AI configuration
     */
    createAiConfig: (data: Partial<AIModel>): Promise<{ success?: boolean; data?: AIModel }> => {
        return ApiService.post("/v1/admin/ai-config", data);
    },

    /**
     * Delete an AI configuration
     */
    deleteAiConfig: (id: string): Promise<{ success?: boolean }> => {
        return ApiService.delete(`/v1/admin/ai-config/${id}`);
    },
};
