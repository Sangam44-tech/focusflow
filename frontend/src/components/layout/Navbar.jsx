// frontend/src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FocusFlow</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/projects"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Projects
              </Link>
              <Link
                to="/ai-planner"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                AI Planner
              </Link>
              <Link
                to="/analytics"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Analytics
              </Link>
            </div>
          )}
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-medium text-sm">
                      {user?.name?.charAt(0) || user?.email?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user?.name || user?.email}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};