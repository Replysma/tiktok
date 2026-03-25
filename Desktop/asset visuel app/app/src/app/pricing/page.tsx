'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Button from '@/components/button';
import Card from '@/components/card';
import Alert from '@/components/alert';

export default function PricingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleUpgrade = async () => {
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/stripe/session', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.error || 'Failed to create checkout session');
                return;
            }

            // Redirect to Stripe Checkout
            window.location.href = `https://checkout.stripe.com/pay/${data.data.sessionId}`;
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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Link href="/dashboard" className="text-blue-600 mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>

                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Choose Your Plan
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Start free and upgrade when you&apos;re ready to automate more
                        </p>
                    </div>

                    {error && <Alert type="error" message={error} />}

                    <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        {/* Free Plan */}
                        <Card className="border-2 border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Free
                                </h3>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                    $0
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="text-gray-700 dark:text-gray-300 flex items-center">
                                        <span className="text-green-600 mr-3">✓</span>
                                        3 Automations
                                    </li>
                                    <li className="text-gray-700 dark:text-gray-300 flex items-center">
                                        <span className="text-green-600 mr-3">✓</span>
                                        Basic Logs
                                    </li>
                                    <li className="text-gray-700 dark:text-gray-300 flex items-center">
                                        <span className="text-green-600 mr-3">✓</span>
                                        Email Support
                                    </li>
                                    <li className="text-gray-700 dark:text-gray-300 flex items-center">
                                        <span className="text-green-600 mr-3">✓</span>
                                        TikTok, Discord, Email
                                    </li>
                                </ul>
                                <Button variant="secondary" disabled>
                                    Current Plan
                                </Button>
                            </div>
                        </Card>

                        {/* Premium Plan */}
                        <Card className="border-2 border-blue-500 dark:border-blue-400 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Premium
                                </h3>
                                <p className="text-4xl font-bold text-blue-600 mb-2">
                                    $9.99
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    per month
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="text-gray-700 dark:text-gray-300 flex items-center">
                                        <span className="text-green-600 mr-3">✓</span>
                                        Unlimited Automations
                                    </li>
                                    <li className="text-gray-700 dark:text-gray-300 flex items-center">
                                        <span className="text-green-600 mr-3">✓</span>
                                        Advanced Logs
                                    </li>
                                    <li className="text-gray-700 dark:text-gray-300 flex items-center">
                                        <span className="text-green-600 mr-3">✓</span>
                                        Priority Support
                                    </li>
                                    <li className="text-gray-700 dark:text-gray-300 flex items-center">
                                        <span className="text-green-600 mr-3">✓</span>
                                        Custom Integrations
                                    </li>
                                    <li className="text-gray-700 dark:text-gray-300 flex items-center">
                                        <span className="text-green-600 mr-3">✓</span>
                                        API Access
                                    </li>
                                </ul>
                                <Button onClick={handleUpgrade} disabled={loading}>
                                    {loading ? 'Processing...' : 'Upgrade to Premium'}
                                </Button>
                            </div>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-600 dark:text-gray-400">
                            Need a custom plan?{' '}
                            <a href="mailto:support@autoflow.com" className="text-blue-600 hover:text-blue-700">
                                Contact us
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}