// frontend/src/features/tasks/components/TaskList.jsx
import { useState } from 'react';
import { TaskItem } from './TaskItem';
import { TaskFormModal } from './TaskFormModal';
import { Button } from '../../../components/common/Button';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';

export const TaskList = ({ 
  tasks, 
  onCreateTask, 
  onUpdateTask, 
  onStatusChange, 
  onDeleteTask,
  loading = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, TODO, IN_PROGRESS, COMPLETED
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    return task.status === filter;
  });
  
  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };
  
  const handleSubmit = async (data) => {
    if (editingTask) {
      await onUpdateTask(editingTask.id, data);
    } else {
      await onCreateTask(data);
    }
    handleCloseModal();
  };
  
  // Group tasks by status for better organization
  const todoTasks = filteredTasks.filter(t => t.status === 'TODO');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
  const completedTasks = filteredTasks.filter(t => t.status === 'COMPLETED');
  
  const TaskSection = ({ title, tasks, count }) => (
    tasks.length > 0 && (
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          {title} ({count})
        </h4>
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={handleEdit}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      </div>
    )
  );
  
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === f 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f === 'ALL' ? 'All' : f === 'IN_PROGRESS' ? 'In Progress' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          
          {/* Add Task Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>
      
      {/* Task Lists */}
      {filter === 'ALL' ? (
        <>
          <TaskSection title="In Progress" tasks={inProgressTasks} count={inProgressTasks.length} />
          <TaskSection title="To Do" tasks={todoTasks} count={todoTasks.length} />
          <TaskSection title="Completed" tasks={completedTasks} count={completedTasks.length} />
        </>
      ) : (
        <div className="space-y-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={onStatusChange}
                onEdit={handleEdit}
                onDelete={onDeleteTask}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No tasks found
            </div>
          )}
        </div>
      )}
      
      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-4">Create your first task to get started</p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>
      )}
      
      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        task={editingTask}
        loading={loading}
      />
    </div>
  );
};