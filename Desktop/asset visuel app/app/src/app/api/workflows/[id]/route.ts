import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, ApiError } from '@/lib/errors';

// GET /api/workflows/[id]
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

        const workflow = await prisma.workflow.findFirst({
            where: { id: params.id, userId: payload.id },
            include: {
                trigger: true,
                actions: { orderBy: { order: 'asc' } },
            },
        });

        if (!workflow) {
            throw new ApiError(404, 'Workflow not found');
        }

        return NextResponse.json(successResponse(workflow));
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to fetch workflow');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}

// PUT /api/workflows/[id]
export async function PUT(
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

        const { name, description, enabled } = await req.json();

        // Verify ownership
        const workflow = await prisma.workflow.findFirst({
            where: { id: params.id, userId: payload.id },
        });

        if (!workflow) {
            throw new ApiError(404, 'Workflow not found');
        }

        // Update workflow
        const updated = await prisma.workflow.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(enabled !== undefined && { enabled }),
            },
            include: {
                trigger: true,
                actions: { orderBy: { order: 'asc' } },
            },
        });

        return NextResponse.json(successResponse(updated));
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to update workflow');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}

// DELETE /api/workflows/[id]
export async function DELETE(
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

        // Delete workflow (cascade deletes trigger, actions, logs)
        await prisma.workflow.delete({
            where: { id: params.id },
        });

        return NextResponse.json(successResponse({ id: params.id }, 'Workflow deleted'));
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to delete workflow');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}
