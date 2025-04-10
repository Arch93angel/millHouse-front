import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateTaskMutation } from '../services/taskApi';
import { useGetUsersQuery } from '../services/authApi';
import { format, parseISO } from 'date-fns';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const EditTaskForm = ({ task, onCancel, onSuccess }) => {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm();

  const categoryOptions = [
    { value: 'MILLING', label: 'Milling Only' },
    { value: 'GRINDING', label: 'Grinding Only' },
    { value: 'MILLING_GRINDING', label: 'Milling and Grinding' },
  ];

  const selectedCategory = watch('category');

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        category: task.category,
        assigned_to_id: task.assigned_to.id,
        delivery_date: format(parseISO(task.delivery_date), "yyyy-MM-dd'T'HH:mm"),
        amount_received: task.amount_received || '',
        status: task.status
      });
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const updateData = {
        id: task.id,
        ...data,
        amount_received: data.amount_received ? parseFloat(data.amount_received) : null
      };

      await updateTask(updateData).unwrap();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to update task:', err);
      setApiError(err.data?.detail || 'Failed to update task. Please try again.');
    }
  };

  const handleCategorySelect = (value) => {
    setValue('category', value);
    setIsCategoryOpen(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
      
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register('title', { required: 'Title is required' })}
            className={`mt-1 block w-full rounded-md border ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className={`mt-1 block w-full rounded-md border ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <input
                type="hidden"
                {...register('category', { required: 'Category is required' })}
              />
              <button
                type="button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`relative w-full text-left rounded-md border ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                } bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
              >
                <span className="block truncate">
                  {categoryOptions.find(opt => opt.value === selectedCategory)?.label || 'Select category'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </button>
              
              {isCategoryOpen && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {categoryOptions.map((option) => (
                    <li
                      key={option.value}
                      className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50"
                      onClick={() => handleCategorySelect(option.value)}
                    >
                      <span className={`block truncate ${
                        selectedCategory === option.value ? 'font-semibold text-blue-600' : 'font-normal'
                      }`}>
                        {option.label}
                      </span>
                      {selectedCategory === option.value && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                          <CheckCircleIcon className="h-5 w-5" />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="assigned_to_id" className="block text-sm font-medium text-gray-700">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              id="assigned_to_id"
              {...register('assigned_to_id', { required: 'Assignee is required' })}
              className={`mt-1 block w-full rounded-md border ${
                errors.assigned_to_id ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
              disabled={isLoading || isLoadingUsers}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            {errors.assigned_to_id && (
              <p className="mt-1 text-sm text-red-600">{errors.assigned_to_id.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="delivery_date" className="block text-sm font-medium text-gray-700">
              Delivery Date <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              id="delivery_date"
              {...register('delivery_date', { required: 'Delivery date is required' })}
              className={`mt-1 block w-full rounded-md border ${
                errors.delivery_date ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
              disabled={isLoading}
            />
            {errors.delivery_date && (
              <p className="mt-1 text-sm text-red-600">{errors.delivery_date.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount_received" className="block text-sm font-medium text-gray-700">
              Amount Received ($)
            </label>
            <input
              type="number"
              id="amount_received"
              {...register('amount_received')}
              step="0.01"
              min="0"
              className={`mt-1 block w-full rounded-md border ${
                errors.amount_received ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <XCircleIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Cancel
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5 text-white" />
                Update Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;