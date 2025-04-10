import { useState } from 'react'
import { useLoginMutation } from '../services/authApi'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await login(formData).unwrap()
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}