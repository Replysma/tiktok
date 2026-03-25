'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/navbar';
import Card from '@/components/card';
import Button from '@/components/button';
import WorkflowLogs from '@/components/workflow-logs';
import Alert from '@/components/alert';

export default function WorkflowDetailPage() {
    const router = useRouter();
    const params = useParams();
    const workflowId = params.id as string;

    const [workflow, setWorkflow] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchWorkflow(token);
    }, [router, workflowId]);

    const fetchWorkflow = async (token: string) => {
        try {
            const res = await fetch(`/api/workflows/${workflowId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setWorkflow(data.data);
            } else {
                setError('Workflow not found');
            }
        } catch (err) {
            setError('Failed to load workflow');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/workflows/${workflowId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ enabled: !workflow.enabled }),
            });

            if (res.ok) {
                const data = await res.json();
                setWorkflow(data.data);
            }
        } catch (err) {
            console.error('Failed to toggle workflow:', err);
        }
    };

    const handleRunNow = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/workflows/${workflowId}/trigger`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                alert('Workflow execution started!');
                // Refresh logs after a delay
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                alert('Failed to trigger workflow');
            }
        } catch (err) {
            alert('Failed to trigger workflow');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this workflow?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/workflows/${workflowId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                router.push('/dashboard');
            }
        } catch (err) {
            setError('Failed to delete workflow');
            console.error(err);
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

    if (!workflow) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <Alert type="error" message={error || 'Workflow not found'} />
                    <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Button variant="secondary" onClick={() => router.push('/dashboard')}>
                        ← Back to Dashboard
                    </Button>

                    {error && <Alert type="error" message={error} />}

                    <Card className="mt-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {workflow.name}
                                </h1>
                                {workflow.description && (
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">{workflow.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleRunNow}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                                >
                                    Run Now
                                </button>
                                <button onClick={handleToggle}
                                    className={`px-4 py-2 rounded font-medium ${workflow.enabled
                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {workflow.enabled ? '✓ Active' : '○ Disabled'}
                                </button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Workflow Configuration */}
                    <Card title="Configuration" className="mb-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Trigger
                                </h3>
                                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded">
                                    <p className="font-medium text-blue-900 dark:text-blue-100">
                                        {workflow.trigger?.type}
                                    </p>
                                    {workflow.trigger?.config && (
                                        <pre className="text-sm text-gray-700 dark:text-gray-300 mt-2 overflow-auto">
                                            {JSON.stringify(JSON.parse(workflow.trigger.config), null, 2)}
                                        </pre>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Actions ({workflow.actions?.length || 0})
                                </h3>
                                <div className="space-y-2">
                                    {workflow.actions?.map((action: any, idx: number) => (
                                        <div key={action.id} className="bg-purple-50 dark:bg-purple-900 p-3 rounded">
                                            <p className="font-medium text-purple-900 dark:text-purple-100">
                                                {idx + 1}. {action.type}
                                            </p>
                                            {action.config && (
                                                <pre className="text-xs text-gray-700 dark:text-gray-300 mt-1 overflow-auto">
                                                    {JSON.stringify(JSON.parse(action.config), null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Logs */}
                    <WorkflowLogs workflowId={workflowId} />
                </div>
            </div>
        </>
    );
}
