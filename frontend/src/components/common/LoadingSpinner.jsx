// frontend/src/components/common/LoadingSpinner.jsx
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
      />
    </div>
  );
};

export const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);