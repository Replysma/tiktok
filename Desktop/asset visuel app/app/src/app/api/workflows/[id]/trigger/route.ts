import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, ApiError } from '@/lib/errors';
import { executeWorkflow } from '@/lib/workflow-executor';

// POST /api/workflows/[id]/trigger
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = extractToken(req.headers.get('authorization'));
        if (!token) {
            throw new ApiError(401, 'No token provided');
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw new ApiError(401, 'Invalid token');
        }

        // Verify ownership
        const workflow = await prisma.workflow.findFirst({
            where: { id: params.id, userId: payload.id },
        });

        if (!workflow) {
            throw new ApiError(404, 'Workflow not found');
        }

        if (!workflow.enabled) {
            throw new ApiError(400, 'Workflow is disabled');
        }

        // Execute workflow asynchronously
        executeWorkflow(params.id, payload.id)
            .then(() => {
                console.log(`Workflow ${params.id} executed successfully`);
            })
            .catch((error) => {
                console.error(`Workflow ${params.id} execution failed:`, error);
            });

        return NextResponse.json(
            successResponse({ message: 'Workflow execution started' })
        );
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to trigger workflow');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}