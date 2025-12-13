// frontend/src/features/projects/components/ProjectCard.jsx
import { Link } from 'react-router-dom';
import { 
  FolderIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  EllipsisVerticalIcon 
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import { format } from 'date-fns';

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
};

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  ARCHIVED: 'bg-gray-100 text-gray-600',
};

export const ProjectCard = ({ project, onEdit, onDelete }) => {
  const completedTasks = project.tasks?.filter(t => t.status === 'COMPLETED').length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Color Bar */}
      <div 
        className="h-2 rounded-t-xl" 
        style={{ backgroundColor: project.color || '#6366f1' }}
      />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Link to={`/projects/${project.id}`} className="flex-1">
            <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
              {project.name}
            </h3>
          </Link>
          
          {/* Actions Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="p-1 rounded-lg hover:bg-gray-100">
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onEdit(project)}
                    className={`${active ? 'bg-gray-50' : ''} w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    Edit Project
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onDelete(project.id)}
                    className={`${active ? 'bg-gray-50' : ''} w-full text-left px-4 py-2 text-sm text-red-600`}
                  >
                    Delete Project
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
        
        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            <span>{completedTasks}/{totalTasks} tasks</span>
          </div>
          
          {project.deadline && (
            <div className="flex items-center text-gray-500">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>{format(new Date(project.deadline), 'MMM d')}</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex items-center gap-2 mt-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[project.priority]}`}>
            {project.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>
      </div>
    </div>
  );
};