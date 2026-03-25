'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/card';

interface WorkflowLogsProps {
    workflowId: string;
}

export default function WorkflowLogs({ workflowId }: WorkflowLogsProps) {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/workflows/${workflowId}/logs`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [workflowId]);

    if (loading) return <p className="text-gray-500">Loading logs...</p>;

    return (
        <Card title="Execution Logs">
            {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet</p>
            ) : (
                <div className="space-y-2">
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className={`p-3 rounded border ${log.status === 'success'
                                    ? 'bg-green-50 border-green-300'
                                    : 'bg-red-50 border-red-300'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{log.status.toUpperCase()}</p>
                                    {log.message && <p className="text-sm text-gray-600">{log.message}</p>}
                                    {log.errorDetails && (
                                        <p className="text-sm text-red-600">{log.errorDetails}</p>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500">
                                    {new Date(log.executedAt).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
