// frontend/src/features/analytics/components/ProductivityChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';

export const ProductivityChart = ({ data = [] }) => {
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0);
  const totalCreated = data.reduce((sum, item) => sum + item.created, 0);
  const bestDay = data.reduce((best, item) => 
    item.completed > (best?.completed || 0) ? item : best, null
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">Weekly Productivity</h3>
            <p className="text-sm text-gray-500">Last 30 days by day of week</p>
          </div>
          {bestDay && (
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{bestDay.day}</div>
              <div className="text-xs text-gray-500">Most productive</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {totalCompleted === 0 && totalCreated === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium mb-2">No activity data yet</p>
            <p className="text-sm text-center">Create and complete tasks to see your weekly patterns</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Completed: {totalCompleted}</span>
              <span>Created: {totalCreated}</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
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
                    formatter={(value, name) => [
                      value, 
                      name === 'completed' ? 'Completed' : 'Created'
                    ]}
                  />
                  <Bar
                    dataKey="completed"
                    fill="#10b981"
                    radius={[2, 2, 0, 0]}
                    name="completed"
                  />
                  <Bar
                    dataKey="created"
                    fill="#6366f1"
                    radius={[2, 2, 0, 0]}
                    name="created"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4 space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span>Created</span>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};