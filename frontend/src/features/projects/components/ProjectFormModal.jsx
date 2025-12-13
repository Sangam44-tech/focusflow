// frontend/src/features/projects/components/ProjectFormModal.jsx
import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  deadline: z.string().optional(),
});

const colorOptions = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', 
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6',
];

export const ProjectFormModal = ({ isOpen, onClose, onSubmit, project = null, loading = false }) => {
  const isEditing = !!project;
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#6366f1',
      priority: 'MEDIUM',
      deadline: '',
    },
  });
  
  const selectedColor = watch('color');
  
  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description || '',
        color: project.color || '#6366f1',
        priority: project.priority,
        deadline: project.deadline ? project.deadline.split('T')[0] : '',
      });
    } else {
      reset({
        name: '',
        description: '',
        color: '#6366f1',
        priority: 'MEDIUM',
        deadline: '',
      });
    }
  }, [project, reset]);
  
  const handleFormSubmit = async (data) => {
    // Convert empty strings to undefined
    const cleanData = {
      ...data,
      description: data.description || undefined,
      deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
    };
    
    await onSubmit(cleanData);
    onClose();
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
                    {isEditing ? 'Edit Project' : 'Create New Project'}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                  {/* Project Name */}
                  <Input
                    label="Project Name"
                    placeholder="My Awesome Project"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="What's this project about?"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      {...register('description')}
                    />
                  </div>
                  
                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setValue('color', color)}
                          className={`w-8 h-8 rounded-full transition-transform ${
                            selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Priority */}
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
                  
                  {/* Deadline */}
                  <Input
                    label="Deadline (optional)"
                    type="date"
                    {...register('deadline')}
                  />
                  
                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                      {isEditing ? 'Save Changes' : 'Create Project'}
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