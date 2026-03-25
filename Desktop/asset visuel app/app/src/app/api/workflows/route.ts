import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, ApiError } from '@/lib/errors';
import { getWorkflowLimit } from '@/lib/integrations';

// GET /api/workflows
export async function GET(req: NextRequest) {
    try {
        const token = extractToken(req.headers.get('authorization'));
        if (!token) {
            throw new ApiError(401, 'No token provided');
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw new ApiError(401, 'Invalid token');
        }

        const workflows = await prisma.workflow.findMany({
            where: { userId: payload.id },
            include: {
                trigger: true,
                actions: { orderBy: { order: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(successResponse(workflows));
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to fetch workflows');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}

// POST /api/workflows
export async function POST(req: NextRequest) {
    try {
        const token = extractToken(req.headers.get('authorization'));
        if (!token) {
            throw new ApiError(401, 'No token provided');
        }

        const payload = verifyToken(token);
        if (!payload) {
            throw new ApiError(401, 'Invalid token');
        }

        const { name, description, trigger, actions } = await req.json();

        // Validate input
        if (!name || !trigger) {
            throw new ApiError(400, 'Name and trigger are required');
        }

        // Check workflow limit
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: {
                subscription: true,
                workflows: true,
            },
        });

        if (!user || !user.subscription) {
            throw new ApiError(404, 'User or subscription not found');
        }

        const limit = getWorkflowLimit(user.subscription.plan as any);
        if (user.workflows.length >= limit) {
            throw new ApiError(429, `Workflow limit reached. Upgrade to premium for unlimited workflows.`);
        }

        // Create workflow with trigger and actions
        const workflow = await prisma.workflow.create({
            data: {
                userId: payload.id,
                name,
                description,
                trigger: {
                    create: {
                        type: trigger.type,
                        config: JSON.stringify(trigger.config),
                    },
                },
                actions: {
                    create: (actions || []).map((action: any, idx: number) => ({
                        type: action.type,
                        config: JSON.stringify(action.config),
                        order: idx + 1,
                    })),
                },
            },
            include: {
                trigger: true,
                actions: { orderBy: { order: 'asc' } },
            },
        });

        return NextResponse.json(successResponse(workflow), { status: 201 });
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to create workflow');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}
