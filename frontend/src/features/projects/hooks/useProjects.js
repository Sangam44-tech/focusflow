// frontend/src/features/projects/hooks/useProjects.js
import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  const createProject = async (data) => {
    try {
      const newProject = await projectService.create(data);
      setProjects(prev => [newProject, ...prev]);
      toast.success('Project created!');
      return newProject;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create project';
      toast.error(message);
      throw err;
    }
  };
  
  const updateProject = async (id, data) => {
    try {
      const updated = await projectService.update(id, data);
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      toast.success('Project updated!');
      return updated;
    } catch (err) {
      toast.error('Failed to update project');
      throw err;
    }
  };
  
  const deleteProject = async (id) => {
    try {
      await projectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted!');
    } catch (err) {
      toast.error('Failed to delete project');
      throw err;
    }
  };
  
  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};