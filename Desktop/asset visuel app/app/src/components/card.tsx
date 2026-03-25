'use client';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Card({ title, children, className = '' }: CardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
            {title && (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
            )}
            {children}
        </div>
    );
}
