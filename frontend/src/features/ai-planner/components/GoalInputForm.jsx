// frontend/src/features/ai-planner/components/GoalInputForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Card, CardBody } from '../../../components/common/Card';

const goalSchema = z.object({
  goal: z.string().min(10, 'Please describe your goal in more detail (min 10 characters)'),
  experience: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  hoursPerDay: z.number().min(0.5).max(12),
  durationWeeks: z.number().min(1).max(52),
  additionalContext: z.string().optional(),
});

const experienceLevels = [
  { value: 'BEGINNER', label: 'Beginner', description: 'New to this topic' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Some experience' },
  { value: 'ADVANCED', label: 'Advanced', description: 'Experienced practitioner' },
];

export const GoalInputForm = ({ onSubmit, loading }) => {
  const [selectedExperience, setSelectedExperience] = useState('BEGINNER');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal: '',
      experience: 'BEGINNER',
      hoursPerDay: 2,
      durationWeeks: 4,
      additionalContext: '',
    },
  });

  const handleExperienceSelect = (value) => {
    setSelectedExperience(value);
    setValue('experience', value);
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      hoursPerDay: parseFloat(data.hoursPerDay),
      durationWeeks: parseInt(data.durationWeeks),
    });
  };

  return (
    <Card>
      <CardBody>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mr-3">
            <SparklesIcon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Goal Planner</h2>
            <p className="text-sm text-gray-500">Describe your goal and let AI create a plan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Goal Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to achieve?
            </label>
            <textarea
              rows={4}
              placeholder="e.g., Learn Python programming and build a web application with Django framework..."
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                errors.goal ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('goal')}
            />
            {errors.goal && (
              <p className="mt-1 text-sm text-red-600">{errors.goal.message}</p>
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your experience level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleExperienceSelect(level.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedExperience === level.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-medium ${
                    selectedExperience === level.value ? 'text-primary-700' : 'text-gray-900'
                  }`}>
                    {level.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{level.description}</p>
                </button>
              ))}
            </div>
            <input type="hidden" {...register('experience')} />
          </div>

          {/* Time Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours per day
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register('hoursPerDay', { valueAsNumber: true })}
              >
                <option value={0.5}>30 minutes</option>
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={3}>3 hours</option>
                <option value={4}>4 hours</option>
                <option value={6}>6 hours</option>
                <option value={8}>8 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                {...register('durationWeeks', { valueAsNumber: true })}
              >
                <option value={1}>1 week</option>
                <option value={2}>2 weeks</option>
                <option value={4}>4 weeks</option>
                <option value={6}>6 weeks</option>
                <option value={8}>8 weeks</option>
                <option value={12}>12 weeks</option>
              </select>
            </div>
          </div>

          {/* Additional Context */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional context (optional)
            </label>
            <textarea
              rows={2}
              placeholder="Any specific requirements, constraints, or focus areas..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              {...register('additionalContext')}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            {loading ? 'Generating Plan...' : 'Generate AI Plan'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};