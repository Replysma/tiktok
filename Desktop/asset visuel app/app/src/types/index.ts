// User types
export interface UserPayload {
    id: string;
    email: string;
    iat?: number;
    exp?: number;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
}

// Workflow types
export interface WorkflowTriggerConfig {
    type: 'tiktok_post' | 'email_received' | 'scheduled';
    username?: string; // for TikTok
    interval?: number; // for scheduled (in minutes)
    email?: string; // for email
}

export interface WorkflowActionConfig {
    type: 'discord_message' | 'google_drive_save' | 'email_send';
    webhookUrl?: string; // for Discord
    discordChannel?: string;
    googleDriveFolderId?: string; // for Google Drive
    emailTo?: string; // for Email
    messageTemplate?: string;
}

export interface WorkflowResponse {
    id: string;
    userId: string;
    name: string;
    description?: string;
    enabled: boolean;
    trigger: {
        type: string;
        config: WorkflowTriggerConfig;
    };
    actions: Array<{
        id: string;
        type: string;
        config: WorkflowActionConfig;
        order: number;
    }>;
    createdAt: string;
    updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Log types
export interface WorkflowLogEntry {
    id: string;
    workflowId: string;
    status: 'success' | 'error';
    message?: string;
    executedAt: string;
}

export interface Subscription {
    id: string;
    plan: 'free' | 'premium';
    workflowLimit: number;
    createdAt: string;
    expiresAt?: string;
}
