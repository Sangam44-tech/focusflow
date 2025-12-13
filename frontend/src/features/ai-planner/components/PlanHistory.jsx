// frontend/src/features/ai-planner/components/PlanHistory.jsx
import { format } from 'date-fns';
import {
  ClockIcon,
  TrashIcon,
  CheckBadgeIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';

export const PlanHistory = ({ plans, onSelect, onDelete, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <div className="animate-pulse">Loading history...</div>
        </CardBody>
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No previous plans</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Recent Plans</h3>
      </CardHeader>
      <CardBody className="p-0">
        <ul className="divide-y divide-gray-100">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {plan.generatedTasks?.planTitle || plan.goal}
                    </h4>
                    {plan.imported && (
                      <CheckBadgeIcon className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{plan.goal}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {format(new Date(plan.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelect(plan)}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(plan.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};