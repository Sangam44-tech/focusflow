// frontend/src/features/analytics/components/HealthScore.jsx
import { Card, CardBody, CardHeader } from '../../../components/common/Card';

export const HealthScore = ({ health }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const metrics = [
    { label: 'Consistency', value: health.breakdown.consistency, description: 'Regular activity' },
    { label: 'Completion', value: health.breakdown.completion, description: 'Tasks completed' },
    { label: 'Streak', value: health.breakdown.streak, description: 'Consecutive days' },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Goal Health Score</h3>
        <p className="text-sm text-gray-500">Your overall productivity health</p>
      </CardHeader>
      <CardBody>
        {/* Main Score */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={health.overall >= 60 ? '#22c55e' : health.overall >= 40 ? '#eab308' : '#ef4444'}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(health.overall / 100) * 352} 352`}
                transform="rotate(-90 64 64)"
              />
            </svg>
            <div className="absolute">
              <span className={`text-4xl font-bold ${getScoreColor(health.overall)}`}>
                {health.overall}
              </span>
              <span className="text-gray-400 text-lg">/100</span>
            </div>
          </div>
          <p className="mt-2 text-gray-600">
            {health.overall >= 80 ? 'Excellent! Keep it up!' :
             health.overall >= 60 ? 'Good progress!' :
             health.overall >= 40 ? 'Room for improvement' :
             'Let\'s get back on track!'}
          </p>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{metric.label}</span>
                <span className="font-medium text-gray-900">{metric.value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(metric.value)}`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Overdue Warning */}
        {health.breakdown.overduePenalty > 0 && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              ⚠️ {Math.round(health.breakdown.overduePenalty / 5)} overdue tasks affecting your score
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};