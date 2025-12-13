// frontend/src/features/analytics/components/StreakDisplay.jsx
import { FireIcon } from '@heroicons/react/24/solid';
import { Card, CardBody } from '../../../components/common/Card';

export const StreakDisplay = ({ streak }) => {
  return (
    <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm mb-1">Current Streak</p>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold">{streak.current}</span>
              <span className="text-xl ml-2">days</span>
            </div>
            <p className="text-orange-100 text-sm mt-2">
              Best streak: {streak.best} days
            </p>
          </div>
          <FireIcon className="w-16 h-16 text-orange-200" />
        </div>

        {streak.current > 0 && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              🎉 {streak.current >= 7 ? 'Amazing! You\'re on fire!' :
                   streak.current >= 3 ? 'Great job! Keep going!' :
                   'Good start! Build that habit!'}
            </p>
          </div>
        )}

        {streak.current === 0 && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              Complete a task today to start your streak! 💪
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};