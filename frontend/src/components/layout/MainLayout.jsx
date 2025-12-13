// frontend/src/components/layout/MainLayout.jsx
import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && !isDesktop && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`peer fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen || isDesktop ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar isMobile={!isDesktop} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${
        isDesktop ? 'ml-16 peer-hover:ml-72' : 'ml-0'
      }`}>
        {/* Mobile header */}
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="hidden xs:block">
              <span className="font-bold text-gray-900 text-base">FocusFlow</span>
              <p className="text-xs text-gray-500 font-medium">Goal Tracker</p>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
        
        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};