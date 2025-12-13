// frontend/src/features/tasks/hooks/useTasks.js
import { useState, useCallback } from 'react';
import { taskService } from '../services/taskService';
import toast from 'react-hot-toast';

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      const data = await taskService.getByProject(projectId);
      setTasks(data);
    } catch (err) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);
  
  const createTask = async (data) => {
    try {
      const newTask = await taskService.create(projectId, data);
      setTasks(prev => [...prev, newTask]);
      toast.success('Task created!');
      return newTask;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task';
      toast.error(message);
      throw err;
    }
  };
  
  const updateTask = async (taskId, data) => {
    try {
      const updated = await taskService.update(taskId, data);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      toast.success('Task updated!');
      return updated;
    } catch (err) {
      toast.error('Failed to update task');
      throw err;
    }
  };
  
  const updateTaskStatus = async (taskId, status) => {
    try {
      const updated = await taskService.updateStatus(taskId, status);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      
      if (status === 'COMPLETED') {
        toast.success('Task completed! 🎉');
      }
      return updated;
    } catch (err) {
      toast.error('Failed to update status');
      throw err;
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      toast.success('Task deleted!');
    } catch (err) {
      toast.error('Failed to delete task');
      throw err;
    }
  };
  
  const reorderTasks = async (newTaskIds) => {
    // Optimistic update
    const reorderedTasks = newTaskIds.map((id, index) => {
      const task = tasks.find(t => t.id === id);
      return { ...task, order: index };
    });
    setTasks(reorderedTasks);
    
    try {
      await taskService.reorder(projectId, newTaskIds);
    } catch (err) {
      // Revert on error
      fetchTasks();
      toast.error('Failed to reorder tasks');
    }
  };
  
  return {
    tasks,
    loading,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    reorderTasks,
    setTasks,
  };
};