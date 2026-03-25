import { ApiResponse } from '@/types';

/**
 * API Error class
 */
export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public details?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Success response handler
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        success: true,
        data,
        message,
    };
}

/**
 * Error response handler
 */
export function errorResponse(error: unknown, defaultMessage = 'An error occurred'): ApiResponse {
    const message = error instanceof ApiError
        ? error.message
        : error instanceof Error
            ? error.message
            : defaultMessage;

    return {
        success: false,
        error: message,
    };
}
