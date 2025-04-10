// import { useState } from 'react'
// import TaskList from './components/TaskList'
// import AddTaskForm from './components/AddTaskForm'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './pages/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  
  


  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />} />
          {/* <Route path="/tasks" element={<TaskList />} /> */}
          {/* other protected routes */}
        </Route>
      </Routes>
    </BrowserRouter>
      
  )
}

export default App