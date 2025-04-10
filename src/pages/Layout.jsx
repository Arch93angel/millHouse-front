import { useState } from 'react'
import AddTaskForm from '../components/AddTaskForm'
import EditTaskForm from '../components/EditTaskForm'
import TaskList from '../components/TaskList'

function Layout() {
    const [showForm, setShowForm] = useState(false)

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <header className="bg-blue-400 fixed top-0 right-0 left-0 mx-auto p-4 text-center">
          
        <h1 className="text-3xl font-bold mb-3">Dashe MilL Tracker</h1>
      
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
          {showForm ? 'Hide Form' : 'Add New Task'}
        </button>
      </header>

      {showForm && <AddTaskForm />}
        <div className="mt-35">
            <h2 className="text-2xl font-semibold mb-4 text-center">Tasks</h2>
            
            <TaskList />
        </div>
        <footer className="fixed bottom-0 right-0 left-0 mx-auto bg-blue-400 p-4 text-center">
          <p>Fate technologies © {new Date().getFullYear()} Task Manager App</p>
        </footer>
    </div>
  )
}

export default Layout