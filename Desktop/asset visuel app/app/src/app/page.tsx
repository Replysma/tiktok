'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Automate Your Workflows
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Connect your favorite apps and automate repetitive tasks. Save time, reduce errors,
                            and focus on what matters most.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                href="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/login"
                                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-medium"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-20 grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Easy Setup',
                                description: 'Create workflows in minutes without any coding knowledge',
                            },
                            {
                                title: 'Multiple Integrations',
                                description: 'Connect TikTok, Discord, Google Drive, Email, and more',
                            },
                            {
                                title: 'Reliable & Secure',
                                description: 'Your data is encrypted and securely stored with SSL',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                            >
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Pricing */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Simple Pricing
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                            {[
                                {
                                    name: 'Free',
                                    price: '$0',
                                    features: ['3 Automations', 'Basic Logs', 'Email Support'],
                                },
                                {
                                    name: 'Premium',
                                    price: '$9.99',
                                    features: ['Unlimited Automations', 'Advanced Logs', 'Priority Support', 'Custom Integrations'],
                                },
                            ].map((plan) => (
                                <div
                                    key={plan.name}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 border-2 border-transparent hover:border-blue-600"
                                >
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-4xl font-bold text-blue-600 mb-6">{plan.price}</p>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="text-gray-700 dark:text-gray-300 flex items-center">
                                                <span className="text-green-600 mr-3">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
