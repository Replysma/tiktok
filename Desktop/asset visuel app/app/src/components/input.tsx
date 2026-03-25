'use client';

interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    error?: string;
    required?: boolean;
}

export default function Input({
    type = 'text',
    placeholder,
    value,
    onChange,
    label,
    error,
    required,
}: InputProps) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                    {required && <span className="text-red-600">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
    );
}
