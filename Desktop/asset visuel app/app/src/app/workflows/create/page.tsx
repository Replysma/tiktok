'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Input from '@/components/input';
import Button from '@/components/button';
import Card from '@/components/card';
import Alert from '@/components/alert';

const TRIGGER_OPTIONS = [
    { value: 'tiktok_post', label: 'TikTok Post' },
    { value: 'email_received', label: 'Email Received' },
    { value: 'scheduled', label: 'Scheduled' },
];

const ACTION_OPTIONS = [
    { value: 'discord_message', label: 'Send Discord Message' },
    { value: 'google_drive_save', label: 'Save to Google Drive' },
    { value: 'email_send', label: 'Send Email' },
];

export default function CreateWorkflowPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [triggerType, setTriggerType] = useState('tiktok_post');
    const [triggerConfig, setTriggerConfig] = useState<any>({});
    const [actions, setActions] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const addAction = () => {
        setActions([...actions, { type: 'discord_message', config: {} }]);
    };

    const updateAction = (index: number, field: string, value: any) => {
        const newActions = [...actions];
        newActions[index] = { ...newActions[index], [field]: value };
        setActions(newActions);
    };

    const removeAction = (index: number) => {
        setActions(actions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const payload = {
                name,
                description,
                trigger: {
                    type: triggerType,
                    config: triggerConfig,
                },
                actions: actions.map((a) => ({
                    type: a.type,
                    config: a.config,
                })),
            };

            const res = await fetch('/api/workflows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.error || 'Failed to create workflow');
                return;
            }

            setSuccess('Workflow created successfully!');
            setTimeout(() => router.push('/dashboard'), 2000);
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
                <div className="max-w-2xl mx-auto px-4">
                    <Link href="/dashboard" className="text-blue-600 mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>

                    <Card title="Create New Workflow">
                        {error && <Alert type="error" message={error} />}
                        {success && <Alert type="success" message={success} />}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Info */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                    Workflow Details
                                </h3>
                                <Input
                                    label="Workflow Name"
                                    placeholder="e.g., TikTok to Discord"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Description"
                                    placeholder="What does this workflow do?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Trigger Configuration */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                    When (Trigger)
                                </h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Select Trigger
                                    </label>
                                    <select
                                        value={triggerType}
                                        onChange={(e) => setTriggerType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
                                    >
                                        {TRIGGER_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {triggerType === 'tiktok_post' && (
                                    <Input
                                        label="TikTok Username"
                                        placeholder="e.g., @username"
                                        value={triggerConfig.username || ''}
                                        onChange={(e) =>
                                            setTriggerConfig({ ...triggerConfig, username: e.target.value })
                                        }
                                    />
                                )}
                                {triggerType === 'scheduled' && (
                                    <Input
                                        type="number"
                                        label="Check Every (minutes)"
                                        placeholder="e.g., 60"
                                        value={triggerConfig.interval || ''}
                                        onChange={(e) =>
                                            setTriggerConfig({ ...triggerConfig, interval: parseInt(e.target.value) })
                                        }
                                    />
                                )}
                            </div>

                            {/* Actions */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                                    Then (Actions)
                                </h3>

                                {actions.map((action, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <select
                                                value={action.type}
                                                onChange={(e) => updateAction(index, 'type', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                            >
                                                {ACTION_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => removeAction(index)}
                                                className="text-red-600 hover:text-red-700 ml-2"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        {action.type === 'discord_message' && (
                                            <Input
                                                label="Discord Webhook URL"
                                                placeholder="https://discord.com/api/webhooks/..."
                                                value={action.config.webhookUrl || ''}
                                                onChange={(e) =>
                                                    updateAction(index, 'config', {
                                                        ...action.config,
                                                        webhookUrl: e.target.value,
                                                    })
                                                }
                                            />
                                        )}
                                        {action.type === 'email_send' && (
                                            <Input
                                                type="email"
                                                label="Recipient Email"
                                                placeholder="recipient@example.com"
                                                value={action.config.emailTo || ''}
                                                onChange={(e) =>
                                                    updateAction(index, 'config', {
                                                        ...action.config,
                                                        emailTo: e.target.value,
                                                    })
                                                }
                                            />
                                        )}
                                        {action.type === 'google_drive_save' && (
                                            <Input
                                                label="Google Drive Folder ID"
                                                placeholder="Folder ID"
                                                value={action.config.googleDriveFolderId || ''}
                                                onChange={(e) =>
                                                    updateAction(index, 'config', {
                                                        ...action.config,
                                                        googleDriveFolderId: e.target.value,
                                                    })
                                                }
                                            />
                                        )}
                                    </div>
                                ))}

                                <Button onClick={addAction} variant="secondary" type="button">
                                    + Add Action
                                </Button>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-4">
                                <Button type="submit" disabled={loading || actions.length === 0}>
                                    {loading ? 'Creating...' : 'Create Workflow'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}

import Link from 'next/link';
