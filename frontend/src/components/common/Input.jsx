// frontend/src/components/common/Input.jsx
import { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-2 border border-gray-300 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});