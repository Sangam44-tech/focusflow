// frontend/src/pages/GoogleCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        toast.error('Google login cancelled');
        navigate('/login');
        return;
      }

      if (!code) {
        toast.error('Invalid callback');
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/oauth/google/callback?code=${code}`);
        
        if (res.redirected) {
          window.location.href = res.url;
          return;
        }

        const data = await res.json();
        
        if (data.success) {
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          toast.success('Welcome!');
          navigate('/dashboard');
        } else {
          toast.error('Login failed');
          navigate('/login');
        }
      } catch (error) {
        toast.error('Connection failed');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Completing login...</span>
    </div>
  );
};