// frontend/src/features/analytics/components/UpcomingDeadlines.jsx
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { CalendarIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';

export const UpcomingDeadlines = ({ deadlines }) => {
  const getDateLabel = (date) => {
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    const days = differenceInDays(d, new Date());
    if (days < 7) return `In ${days} days`;
    return format(d, 'MMM d');
  };

  const getUrgencyColor = (date) => {
    const days = differenceInDays(new Date(date), new Date());
    if (days <= 1) return 'text-red-600 bg-red-50';
    if (days <= 3) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2" />
          Upcoming Deadlines
        </h3>
      </CardHeader>
      <CardBody className="p-0">
        {deadlines.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {deadlines.map((task) => (
              <li key={task.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: task.project?.color || '#6366f1' }}
                      />
                      <p className="font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {task.project?.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(task.dueDate)}`}>
                    {getDateLabel(task.dueDate)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming deadlines</p>
            <p className="text-sm text-gray-400">You're all caught up!</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};