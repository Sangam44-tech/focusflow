// frontend/src/features/ai-planner/components/PlanPreview.jsx
import { useState } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  BookOpenIcon,
  LightBulbIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';

const priorityColors = {
  HIGH: 'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-green-100 text-green-700 border-green-200',
};

export const PlanPreview = ({ plan, onImport, onRegenerate, importing, generating }) => {
  const [expandedWeeks, setExpandedWeeks] = useState([1]);
  const [projectName, setProjectName] = useState(plan.planTitle);

  // Group tasks by week
  const tasksByWeek = plan.tasks.reduce((acc, task) => {
    const week = task.weekNumber || 1;
    if (!acc[week]) acc[week] = [];
    acc[week].push(task);
    return acc;
  }, {});

  const toggleWeek = (week) => {
    setExpandedWeeks(prev =>
      prev.includes(week)
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const handleImport = () => {
    onImport(plan.id, projectName);
  };

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card>
        <CardBody>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.planTitle}</h2>
              <p className="text-gray-600 mb-4">{plan.summary}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {plan.estimatedTotalHours} total hours
                </div>
                <div className="flex items-center text-gray-500">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {plan.tasks.length} tasks
                </div>
                <div className="flex items-center text-gray-500">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  {Object.keys(tasksByWeek).length} weeks
                </div>
              </div>
            </div>

            {plan.imported && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Imported
              </span>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Weekly Tasks */}
      <div className="space-y-4">
        {Object.entries(tasksByWeek).map(([week, tasks]) => (
          <Card key={week}>
            <button
              onClick={() => toggleWeek(parseInt(week))}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-700 font-semibold">W{week}</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Week {week}</h3>
                  <p className="text-sm text-gray-500">{tasks.length} tasks</p>
                </div>
              </div>
              {expandedWeeks.includes(parseInt(week)) ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedWeeks.includes(parseInt(week)) && (
              <CardBody className="pt-0 border-t border-gray-100">
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      
                      {/* Subtasks */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Subtasks</p>
                          <ul className="space-y-1">
                            {task.subtasks.map((subtask, i) => (
                              <li key={i} className="flex items-center text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                                {subtask}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <ClockIcon className="w-3.5 h-3.5 mr-1" />
                          {task.estimatedHours}h estimated
                        </span>
                        {task.successCriteria && (
                          <span className="flex items-center">
                            <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
                            {task.successCriteria}
                          </span>
                        )}
                      </div>
                      
                      {task.tips && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                          <p className="text-xs text-yellow-800 flex items-start">
                            <LightBulbIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                            {task.tips}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            )}
          </Card>
        ))}
      </div>

      {/* Resources */}
      {plan.resources && plan.resources.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 flex items-center">
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Recommended Resources
            </h3>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="grid gap-3">
              {plan.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{resource.title}</p>
                    {resource.description && (
                      <p className="text-sm text-gray-500">{resource.description}</p>
                    )}
                  </div>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                    {resource.type}
                  </span>
                </a>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tips */}
      {plan.tips && plan.tips.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 flex items-center">
              <LightBulbIcon className="w-5 h-5 mr-2" />
              Tips for Success
            </h3>
          </CardHeader>
          <CardBody className="pt-0">
            <ul className="space-y-2">
              {plan.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {/* Import Section */}
      {!plan.imported && (
        <Card className="bg-gradient-to-r from-primary-500 to-primary-600">
          <CardBody>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-white">
                <h3 className="text-lg font-semibold mb-1">Ready to start?</h3>
                <p className="text-primary-100">Import this plan as a project to track your progress</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project name"
                  className="px-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white"
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={onRegenerate}
                    loading={generating}
                    disabled={generating || importing}
                  >
                    <ArrowPathIcon className="w-4 h-4 mr-1" />
                    Regenerate
                  </Button>
                  <Button
                    className="bg-white text-primary-600 hover:bg-gray-100"
                    onClick={handleImport}
                    loading={importing}
                    disabled={importing || generating}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                    Import as Project
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};