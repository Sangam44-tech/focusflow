// frontend/src/components/common/CongratulationsModal.jsx
import { useEffect, useState } from 'react';

export const CongratulationsModal = ({ isOpen, onClose, projectName, completedTasks }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2
      }));
      setConfetti(particles);

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Confetti Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              top: '-10px'
            }}
          />
        ))}
      </div>

      {/* Modal Content */}
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center relative animate-scale-in shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        {/* Trophy Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M3 9V7L9 7.5V9M15 10.5V19C15 20.1 14.1 21 13 21H11C9.9 21 9 20.1 9 19V10.5L15 10.5ZM7.5 7.5C7.5 6.1 8.6 5 10 5H14C15.4 5 16.5 6.1 16.5 7.5V9H7.5V7.5Z"/>
          </svg>
        </div>

        {/* Congratulations Text */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 Congratulations! 🎉
        </h2>
        
        <p className="text-gray-600 mb-4">
          You've completed all tasks in
        </p>
        
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          "{projectName}"
        </h3>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedTasks}</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Amazing work! You're making great progress towards your goals. 
          Keep up the momentum! 🚀
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
          >
            Continue
          </button>
          <button
            onClick={() => {
              // Share achievement (could integrate with social media)
              if (navigator.share) {
                navigator.share({
                  title: 'Goal Achievement!',
                  text: `I just completed all tasks in "${projectName}"! 🎉`,
                });
              }
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all"
          >
            Share 🎊
          </button>
        </div>
      </div>
    </div>
  );
};