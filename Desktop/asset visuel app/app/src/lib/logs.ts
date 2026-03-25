import { prisma } from './prisma';

/**
 * Create a new workflow log entry
 */
export async function createWorkflowLog(
    workflowId: string,
    userId: string,
    status: 'success' | 'error',
    message?: string,
    errorDetails?: string
) {
    try {
        return await prisma.workflowLog.create({
            data: {
                workflowId,
                userId,
                status,
                message,
                errorDetails,
            },
        });
    } catch (error) {
        console.error('Failed to create workflow log:', error);
        return null;
    }
}

/**
 * Get workflow logs for a specific workflow
 */
export async function getWorkflowLogs(workflowId: string, limit = 50) {
    try {
        return await prisma.workflowLog.findMany({
            where: { workflowId },
            orderBy: { executedAt: 'desc' },
            take: limit,
        });
    } catch (error) {
        console.error('Failed to fetch workflow logs:', error);
        return [];
    }
}

/**
 * Get all logs for a user
 */
export async function getUserLogs(userId: string, limit = 100) {
    try {
        return await prisma.workflowLog.findMany({
            where: { userId },
            orderBy: { executedAt: 'desc' },
            take: limit,
            include: {
                workflow: {
                    select: { id: true, name: true },
                },
            },
        });
    } catch (error) {
        console.error('Failed to fetch user logs:', error);
        return [];
    }
}
