import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, ApiError } from '@/lib/errors';
import { getWorkflowLogs } from '@/lib/logs';

// GET /api/workflows/[id]/logs
export async function GET(
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

        const logs = await getWorkflowLogs(params.id, 100);

        return NextResponse.json(successResponse(logs));
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to fetch logs');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}
