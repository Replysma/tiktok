import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, ApiError } from '@/lib/errors';

// POST /api/auth/register
export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        // Validate input
        if (!email || !password) {
            throw new ApiError(400, 'Email and password are required');
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ApiError(409, 'User already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user and subscription
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || email.split('@')[0],
                subscription: {
                    create: {
                        plan: 'free',
                        workflowLimit: 3,
                    },
                },
            },
        });

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
            }),
            { status: 201 }
        );
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Registration failed');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}
