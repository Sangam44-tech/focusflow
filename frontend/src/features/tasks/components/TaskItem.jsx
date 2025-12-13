// frontend/src/features/tasks/components/TaskItem.jsx
import { useState } from 'react';
import { 
  CheckCircleIcon, 
  TrashIcon,
  PencilIcon,
  CalendarIcon,
  GripVerticalIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

const priorityColors = {
  LOW: 'border-l-gray-300',
  MEDIUM: 'border-l-yellow-400',
  HIGH: 'border-l-red-500',
};

const statusStyles = {
  TODO: 'bg-white',
  IN_PROGRESS: 'bg-blue-50',
  COMPLETED: 'bg-green-50',
};

export const TaskItem = ({ 
  task, 
  onStatusChange, 
  onEdit, 
  onDelete,
  isDragging = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = task.status === 'COMPLETED';
  
  const handleToggleComplete = () => {
    const newStatus = isCompleted ? 'TODO' : 'COMPLETED';
    onStatusChange(task.id, newStatus);
  };
  
  const handleStatusChange = (e) => {
    onStatusChange(task.id, e.target.value);
  };
  
  return (
    <div
      className={`
        group flex items-center gap-3 p-4 rounded-lg border-l-4 transition-all
        ${priorityColors[task.priority]}
        ${statusStyles[task.status]}
        ${isDragging ? 'shadow-lg opacity-90' : 'hover:shadow-sm'}
        ${isCompleted ? 'opacity-75' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle */}
      <div className="cursor-grab text-gray-300 hover:text-gray-400">
        <GripVerticalIcon className="w-5 h-5" />
      </div>
      
      {/* Checkbox */}
      <button
        onClick={handleToggleComplete}
        className="flex-shrink-0 transition-colors"
      >
        {isCompleted ? (
          <CheckCircleSolidIcon className="w-6 h-6 text-green-500" />
        ) : (
          <CheckCircleIcon className="w-6 h-6 text-gray-300 hover:text-green-500" />
        )}
      </button>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </p>
        
        {task.description && (
          <p className="text-sm text-gray-500 truncate mt-0.5">
            {task.description}
          </p>
        )}
        
        {/* Meta Info */}
        <div className="flex items-center gap-3 mt-2">
          {task.dueDate && (
            <span className="flex items-center text-xs text-gray-500">
              <CalendarIcon className="w-3.5 h-3.5 mr-1" />
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          )}
          
          {/* Status Dropdown (visible on hover or if in progress) */}
          {(isHovered || task.status === 'IN_PROGRESS') && !isCompleted && (
            <select
              value={task.status}
              onChange={handleStatusChange}
              className="text-xs bg-transparent border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className={`flex items-center gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};