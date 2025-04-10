import { useEffect } from 'react';
import { useUpdateTaskStatusMutation } from '../services/taskApi';

const TaskStatusButton = ({ task }) => {
  const [updateStatus, { isLoading }] = useUpdateTaskStatusMutation();
  
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatus({ id: task.id, status: newStatus }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };
  useEffect(() => {
  updateStatus();
  }, [updateStatus])

  return (
    <div className="flex space-x-2">
      {task.status === 'PENDING' && (
        <button
          onClick={() => handleStatusUpdate('IN_PROGRESS')}
          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Start Work'}
        </button>
      )}
      {task.status === 'IN_PROGRESS' && (
        <button
          onClick={() => handleStatusUpdate('COMPLETED')}
          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Mark Complete'}
        </button>
      )}
    </div>
  );
};

export default TaskStatusButton