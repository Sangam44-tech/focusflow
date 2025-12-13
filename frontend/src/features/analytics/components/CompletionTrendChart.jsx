// frontend/src/features/analytics/components/CompletionTrendChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';

export const CompletionTrendChart = ({ data = [] }) => {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  }));

  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const avgPerDay = data.length > 0 ? (totalCompleted / data.length).toFixed(1) : 0;
  const maxDay = data.reduce((max, item) => item.completed > max ? item.completed : max, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">Task Completion Trend</h3>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{totalCompleted}</div>
            <div className="text-xs text-gray-500">Total completed</div>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        {data.length === 0 || totalCompleted === 0 ? (
          <div className="h-72 flex flex-col items-center justify-center text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium mb-2">No completed tasks yet</p>
            <p className="text-sm text-center">Complete some tasks to see your progress trend here</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Avg: {avgPerDay} tasks/day</span>
              <span>Best day: {maxDay} tasks</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value, name) => [value, 'Tasks completed']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};