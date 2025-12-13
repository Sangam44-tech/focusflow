// frontend/src/pages/Calendar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export const Calendar = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsRes = await api.get('/projects');
      const projectsData = projectsRes.data.data || [];
      setProjects(projectsData);
      
      // Get tasks from all projects
      const allTasks = [];
      for (const project of projectsData) {
        try {
          const taskRes = await api.get(`/projects/${project.id}/tasks`);
          const projectTasks = (taskRes.data.data || []).map(task => ({ 
            ...task, 
            projectName: project.name,
            projectId: project.id,
            projectColor: project.color
          }));
          allTasks.push(...projectTasks);
        } catch (error) {
          console.error('Error fetching tasks for project:', project.id);
        }
      }
      setTasks(allTasks);
    } catch (error) {
      toast.error('Failed to fetch calendar data');
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const upcoming = [];
    
    // Project deadlines
    projects.forEach(project => {
      if (project.deadline) {
        const deadline = new Date(project.deadline);
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        upcoming.push({
          id: `project-${project.id}`,
          type: 'project',
          name: project.name,
          deadline,
          daysLeft,
          status: project.status,
          color: project.color,
          link: `/projects/${project.id}`
        });
      }
    });

    // Task due dates
    tasks.forEach(task => {
      if (task.dueDate && task.status !== 'COMPLETED') {
        const dueDate = new Date(task.dueDate);
        const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        upcoming.push({
          id: `task-${task.id}`,
          type: 'task',
          name: task.title,
          projectName: task.projectName,
          deadline: dueDate,
          daysLeft,
          priority: task.priority,
          color: task.projectColor,
          link: `/projects/${task.projectId}`
        });
      }
    });

    return upcoming.sort((a, b) => a.deadline - b.deadline);
  };

  const getThisWeekTasks = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= weekStart && dueDate <= weekEnd;
    });
  };

  const upcomingDeadlines = getUpcomingDeadlines();
  const thisWeekTasks = getThisWeekTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Calendar & Deadlines</h1>
        <p className="text-gray-600 mt-1">Track your project deadlines and task due dates</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">
                {upcomingDeadlines.filter(item => item.daysLeft < 0).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Due Soon</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">
                {upcomingDeadlines.filter(item => item.daysLeft >= 0 && item.daysLeft <= 3).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">This Week</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{thisWeekTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{upcomingDeadlines.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">📅 Upcoming Deadlines</h2>
            <span className="text-sm text-gray-500">{upcomingDeadlines.length} items</span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.slice(0, 10).map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`block p-4 rounded-xl border-l-4 transition-all hover:shadow-md ${
                    item.daysLeft < 0 
                      ? 'bg-red-50 border-red-500 hover:bg-red-100'
                      : item.daysLeft <= 3
                      ? 'bg-orange-50 border-orange-500 hover:bg-orange-100'
                      : 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color || '#6366f1' }}
                        ></div>
                        <p className="font-semibold text-gray-900">
                          {item.type === 'project' ? '🎯' : '✅'} {item.name}
                        </p>
                      </div>
                      {item.projectName && (
                        <p className="text-sm text-gray-600 ml-5">in {item.projectName}</p>
                      )}
                      <p className="text-sm text-gray-500 ml-5">
                        {item.deadline.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`text-right ${
                      item.daysLeft < 0 ? 'text-red-600' : item.daysLeft <= 3 ? 'text-orange-600' : 'text-blue-600'
                    }`}>
                      <p className="font-semibold text-sm">
                        {item.daysLeft < 0 
                          ? `${Math.abs(item.daysLeft)}d overdue`
                          : item.daysLeft === 0
                          ? 'Due today'
                          : `${item.daysLeft}d left`
                        }
                      </p>
                      {item.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                          item.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                          item.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming deadlines</h3>
                <p className="text-gray-600 mb-4">Set deadlines for your goals and tasks to see them here</p>
                <Link
                  to="/projects"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Create Goal
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Project Progress Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">📊 Goal Progress</h2>
            <Link
              to="/projects"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {projects.length > 0 ? (
              projects.map(project => {
                const projectTasks = tasks.filter(task => task.projectId === project.id);
                const completedTasks = projectTasks.filter(task => task.status === 'COMPLETED').length;
                const progress = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;
                
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: project.color || '#6366f1' }}
                        ></div>
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        project.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: project.color || '#6366f1'
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{completedTasks}/{projectTasks.length} tasks</span>
                      {project.deadline && (
                        <span className={
                          new Date(project.deadline) < new Date() ? 'text-red-600 font-semibold' : 'text-gray-600'
                        }>
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals yet</h3>
                <p className="text-gray-600 mb-4">Create your first goal to track progress</p>
                <Link
                  to="/projects"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Create Goal
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};