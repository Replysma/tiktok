'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Card from '@/components/card';
import Alert from '@/components/alert';

export default function DashboardPage() {
    const router = useRouter();
    const [workflows, setWorkflows] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [subscription, setSubscription] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchUserAndWorkflows(token);
    }, [router]);

    const fetchUserAndWorkflows = async (token: string) => {
        try {
            // Fetch user info and subscription
            const userRes = await fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData.data?.user);
                setSubscription(userData.data?.subscription);
            } else {
                setError('Failed to load user info');
            }

            // Fetch workflows
            const workflowsRes = await fetch('/api/workflows', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (workflowsRes.ok) {
                const workflowsData = await workflowsRes.json();
                setWorkflows(workflowsData.data || []);
            } else {
                setError('Failed to load workflows');
            }
        } catch (err) {
            setError('An error occurred while loading dashboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteWorkflow = async (id: string) => {
        if (!confirm('Are you sure you want to delete this workflow?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/workflows/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setWorkflows(workflows.filter((w) => w.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete workflow:', err);
        }
    };

    const handleToggleWorkflow = async (id: string, enabled: boolean) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/workflows/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ enabled: !enabled }),
            });

            if (res.ok) {
                setWorkflows(
                    workflows.map((w) => (w.id === id ? { ...w, enabled: !enabled } : w))
                );
            }
        } catch (err) {
            console.error('Failed to toggle workflow:', err);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <p className="text-center text-gray-500">Loading...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {error && <Alert type="error" message={error} />}

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Dashboard
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Welcome back, {user?.name || user?.email}!
                            </p>
                        </div>
                        <Link
                            href="/workflows/create"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            + Create Workflow
                        </Link>
                    </div>

                    {/* Subscription Card */}
                    <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {subscription?.plan === 'premium' ? 'Premium' : 'Free'} Plan
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {workflows.length} / {subscription?.workflowLimit === Infinity ? '∞' : subscription?.workflowLimit} automations
                                </p>
                            </div>
                            {subscription?.plan !== 'premium' && (
                                <Link
                                    href="/pricing"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Upgrade to Premium
                                </Link>
                            )}
                        </div>
                    </Card>

                    {/* Workflows */}
                    {workflows.length === 0 ? (
                        <Card className="text-center py-12">
                            <p className="text-gray-500 mb-4">No workflows yet</p>
                            <Link
                                href="/workflows/create"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                            >
                                Create Your First Workflow
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {workflows.map((workflow) => (
                                <Card key={workflow.id} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {workflow.name}
                                        </h3>
                                        {workflow.description && (
                                            <p className="text-gray-600 dark:text-gray-400">{workflow.description}</p>
                                        )}
                                        <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                            <p>Trigger: {workflow.trigger?.type}</p>
                                            <p>Actions: {workflow.actions?.length || 0}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleWorkflow(workflow.id, workflow.enabled)}
                                            className={`px-3 py-2 rounded text-sm font-medium ${workflow.enabled
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {workflow.enabled ? '✓ Active' : '○ Disabled'}
                                        </button>
                                        <Link
                                            href={`/workflows/${workflow.id}`}
                                            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-2 rounded text-sm"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteWorkflow(workflow.id)}
                                            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-2 rounded text-sm hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
