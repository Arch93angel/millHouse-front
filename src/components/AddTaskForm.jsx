import { useState } from 'react';
import { useCreateTaskMutation } from '../services/taskApi';
import { useGetUsersQuery } from '../services/authApi';
import { format } from 'date-fns';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowPathIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

const AddTaskForm = ({ onSuccess }) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const { data: users = [], isLoading: isLoadingUsers, isError: isUsersError } = useGetUsersQuery();
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'MILLING',
    assigned_to: '',
    delivery_date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    amount_received: '',
    status: 'PENDING'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.assigned_to) newErrors.assigned_to = 'Assignee is required';
    if (!formData.delivery_date) newErrors.delivery_date = 'Delivery date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const taskData = {
        ...formData,
        // Convert amount to decimal if provided
        amount_received: formData.amount_received ? parseFloat(formData.amount_received) : null,
        // Ensure assigned_to is an ID number
        assigned_to: parseInt(formData.assigned_to)
      };

      await createTask(taskData).unwrap();
      if (onSuccess) onSuccess();
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        category: 'MILLING',
        assigned_to: '',
        delivery_date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
        amount_received: '',
        status: 'PENDING'
      });
      setErrors({});
    } catch (err) {
      if (err.data) {
        // Handle field-specific errors from API
        const apiErrors = {};
        Object.keys(err.data).forEach(key => {
          apiErrors[key] = Array.isArray(err.data[key]) 
            ? err.data[key].join(' ') 
            : err.data[key];
        });
        setErrors(apiErrors);
      } else {
        setErrors({ api: 'Failed to create task. Please try again.' });
      }
    }
  };

  const categoryOptions = [
    { value: 'MILLING', label: 'Milling Only' },
    { value: 'GRINDING', label: 'Grinding Only' },
    { value: 'MILLING_GRINDING', label: 'Milling and Grinding' },
  ];

  return (
    <div className="bg-white mt-35 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      
      {errors.api && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.title ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.description ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              >
                <span className="block truncate">
                  {categoryOptions.find(opt => opt.value === formData.category)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </button>
              
              {isDropdownOpen && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {categoryOptions.map((option) => (
                    <li
                      key={option.value}
                      className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-50"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, category: option.value }));
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className={`block truncate ${formData.category === option.value ? 'font-semibold text-blue-600' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {formData.category === option.value && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                          <CheckCircleIcon className="h-5 w-5" />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">
              Assign To <span className="text-red-500">*</span>
            </label>
            <select
              id="assigned_to"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.assigned_to ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
              disabled={isLoading || isLoadingUsers}
            >
              <option value="">Select User</option>
              {isLoadingUsers ? (
                <option disabled>Loading users...</option>
              ) : isUsersError ? (
                <option disabled>Error loading users</option>
              ) : (
                users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.displayName}
                  </option>
                ))
              )}
            </select>
            {errors.assigned_to && (
              <p className="mt-1 text-sm text-red-600">{errors.assigned_to}</p>
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
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.delivery_date ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
              disabled={isLoading}
            />
            {errors.delivery_date && (
              <p className="mt-1 text-sm text-red-600">{errors.delivery_date}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount_received" className="block text-sm font-medium text-gray-700">
              Expected Amount ($)
            </label>
            <input
              type="number"
              id="amount_received"
              name="amount_received"
              step="0.01"
              min="0"
              value={formData.amount_received}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.amount_received ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                category: 'MILLING',
                assigned_to: '',
                delivery_date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
                amount_received: '',
                status: 'PENDING'
              });
              setErrors({});
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <XCircleIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Reset
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5 text-white" />
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;