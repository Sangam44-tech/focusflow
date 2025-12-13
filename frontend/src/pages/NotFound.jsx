// frontend/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <span className="text-9xl block mb-4">🔍</span>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved or doesn't exist.
        </p>
        <div className="space-x-4">
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline">View Projects</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};