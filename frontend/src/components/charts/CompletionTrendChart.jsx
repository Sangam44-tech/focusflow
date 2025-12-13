// components/charts/CompletionTrendChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CompletionTrendChart = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Task Completion Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="#6366f1" 
            strokeWidth={2}
            dot={{ fill: '#6366f1' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// components/charts/ActivityHeatmap.jsx
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

export const ActivityHeatmap = ({ data }) => {
  const values = Object.entries(data).map(([date, count]) => ({
    date,
    count
  }));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
      <CalendarHeatmap
        startDate={new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)}
        endDate={new Date()}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) return 'color-empty';
          if (value.count <= 2) return 'color-scale-1';
          if (value.count <= 4) return 'color-scale-2';
          if (value.count <= 6) return 'color-scale-3';
          return 'color-scale-4';
        }}
        tooltipDataAttrs={(value) => ({
          'data-tip': value.date ? `${value.count} tasks on ${value.date}` : 'No activity'
        })}
      />
    </div>
  );
};