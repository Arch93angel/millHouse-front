import { useState } from 'react'
import { useGetTasksQuery, useDeleteTaskMutation, useUpdateTaskMutation } from '../services/taskApi'
import { format } from 'date-fns'
import { TrashIcon } from '@heroicons/react/24/solid'
import EditTaskForm from './EditTaskForm'
import TaskStatusButton from './TaskStatusButton'


const TaskList = () => {
  const { data: tasks, isLoading, isError  } = useGetTasksQuery()
  const [updateTask] = useUpdateTaskMutation();
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTask] = useDeleteTaskMutation()


  const getCategoryColor = (category) => {
    switch(category) {
      case 'MILLING':
        return 'bg-blue-100 text-blue-800';
      case 'GRINDING':
        return 'bg-green-100 text-green-800';
      case 'MILLING_GRINDING':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading tasks</div>

  return (
    <div className="space-y-4">
      
      {tasks?.map((task) => (
        <div key={task.id}  onUpdate={(updates) => updateTask({ id: task.id, ...updates })} className="p-4 border rounded-lg shadow-sm">
          {editingTask?.id === task.id ? (
            <EditTaskForm 
              task={task} 
              onSuccess={() => setEditingTask(null)} 
            />
          ) : (
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{task.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
                  {task.category.replace('_', ' / ')}
                </span>
              <p className="text-gray-600">{task.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Created: {format(new Date(task.created_at), 'MMM dd, yyyy')}</p>
                <p>Delivery: {format(new Date(task.delivery_date), 'MMM dd, yyyy')}</p>
                {task.completed_at && (
                  <p>Completed: {format(new Date(task.completed_at), 'MMM dd, yyyy')}</p>
                )}
                {task.amount_received && (
                  <p>Amount: ${task.amount_received}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                    onClick={() => setEditingTask(task)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <TaskStatusButton task={task} />
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          )}
          <div className="mt-2">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {task.assigned_to.username}
            </span>
            {task.is_completed && (
              <span className="inline-block ml-2 bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-700">
                Completed
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TaskList