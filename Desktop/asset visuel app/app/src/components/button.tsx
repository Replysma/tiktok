'use client';

import { ReactNode } from 'react';

interface ButtonProps {
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    children: ReactNode;
}

export default function Button({
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false,
    children,
}: ButtonProps) {
    const baseStyles = 'px-4 py-2 rounded font-medium transition-colors disabled:opacity-50';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-300 text-gray-900 hover:bg-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]}`}
        >
            {children}
        </button>
    );
}
