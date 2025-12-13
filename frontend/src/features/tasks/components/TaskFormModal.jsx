// frontend/src/features/tasks/components/TaskFormModal.jsx
import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
});

export const TaskFormModal = ({ isOpen, onClose, onSubmit, task = null, loading = false }) => {
  const isEditing = !!task;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
    },
  });
  
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
      });
    }
  }, [task, reset]);
  
  const handleFormSubmit = async (data) => {
    const cleanData = {
      ...data,
      description: data.description || undefined,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    };
    
    await onSubmit(cleanData);
  };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {isEditing ? 'Edit Task' : 'Create New Task'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                  <Input
                    label="Task Title"
                    placeholder="What needs to be done?"
                    error={errors.title?.message}
                    {...register('title')}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add more details..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      {...register('description')}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        {...register('priority')}
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>
                    
                    <Input
                      label="Due Date"
                      type="date"
                      {...register('dueDate')}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                      {isEditing ? 'Save Changes' : 'Create Task'}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};