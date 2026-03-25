import jwt from 'jsonwebtoken';
import { UserPayload } from '@/types';

const SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const EXPIRATION = '30d';

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: { id: string; email: string }): string {
    return jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: EXPIRATION,
    });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): UserPayload | null {
    try {
        const decoded = jwt.verify(token, SECRET) as UserPayload;
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.slice(7);
}
