import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, ApiError } from '@/lib/errors';

// POST /api/auth/login
export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Compare password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Generate token
        const token = generateToken(user);

        return NextResponse.json(
            successResponse({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            })
        );
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Login failed');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}
