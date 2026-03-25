import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse, ApiError } from '@/lib/errors';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});

// GET /api/stripe/session
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

        if (!user?.subscription) {
            throw new ApiError(404, 'Subscription not found');
        }

        return NextResponse.json(
            successResponse({
                plan: user.subscription.plan,
                limit: user.subscription.workflowLimit,
            })
        );
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to fetch subscription');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}

// POST /api/stripe/session - Create checkout session
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

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            include: { subscription: true },
        });

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // In MVP, use a fixed price ID from Stripe test mode
        // In production, create or use existing prices
        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
            line_items: [
                {
                    price: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_1Qyp8pFvVFe8TQbdCIQiLDlO', // Replace with actual premium price ID
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            customer_email: user.email,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json(successResponse({ sessionId: session.id }));
    } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError(500, 'Failed to create checkout session');
        return NextResponse.json(errorResponse(apiError), { status: apiError.status });
    }
}
