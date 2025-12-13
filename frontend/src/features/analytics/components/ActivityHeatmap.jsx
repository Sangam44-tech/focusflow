// frontend/src/features/analytics/components/ActivityHeatmap.jsx
import { useMemo } from 'react';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';

export const ActivityHeatmap = ({ data }) => {
  const { weeks, months } = useMemo(() => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const weeks = [];
    const months = [];
    let currentDate = new Date(sixMonthsAgo);
    let currentWeek = [];
    let lastMonth = -1;

    // Align to start of week (Sunday)
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = data[dateStr] || 0;
      const month = currentDate.getMonth();

      if (month !== lastMonth) {
        months.push({
          name: currentDate.toLocaleDateString('en', { month: 'short' }),
          index: weeks.length,
        });
        lastMonth = month;
      }

      currentWeek.push({
        date: dateStr,
        count,
        dayOfWeek: currentDate.getDay(),
      });

      if (currentDate.getDay() === 6 || currentDate >= today) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { weeks, months };
  }, [data]);

  const getColorClass = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 4) return 'bg-green-400';
    if (count <= 6) return 'bg-green-500';
    return 'bg-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Activity Heatmap</h3>
        <p className="text-sm text-gray-500">Your task completion activity</p>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto">
          {/* Month Labels */}
          <div className="flex mb-2 ml-8">
            {months.map((month, i) => (
              <div
                key={i}
                className="text-xs text-gray-500"
                style={{ marginLeft: i === 0 ? 0 : `${(month.index - months[i - 1].index) * 14 - 30}px` }}
              >
                {month.name}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day Labels */}
            <div className="flex flex-col justify-around text-xs text-gray-500 mr-2">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                    const day = week.find(d => d.dayOfWeek === dayIndex);
                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${day ? getColorClass(day.count) : 'bg-transparent'}`}
                        title={day ? `${day.date}: ${day.count} tasks` : ''}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-gray-100" />
            <div className="w-3 h-3 rounded-sm bg-green-200" />
            <div className="w-3 h-3 rounded-sm bg-green-400" />
            <div className="w-3 h-3 rounded-sm bg-green-500" />
            <div className="w-3 h-3 rounded-sm bg-green-600" />
            <span>More</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};