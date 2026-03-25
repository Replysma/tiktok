'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Input from '@/components/input';
import Button from '@/components/button';
import Alert from '@/components/alert';

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.error || 'Registration failed');
                return;
            }

            // Store token and redirect
            localStorage.setItem('token', data.data.token);
            router.push('/dashboard');
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow max-w-md w-full p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Account</h2>

                    {error && <Alert type="error" message={error} />}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <Input
                            label="Name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <Input
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Register'}
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-700">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
