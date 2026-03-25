import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, ApiError } from '@/lib/errors';

// GET /api/auth/me
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

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { subscription: true },
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return NextResponse.json(
            successResponse({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
                subscription: user.subscription,
            })
        );
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to fetch user');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}
