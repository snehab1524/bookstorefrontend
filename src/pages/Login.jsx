import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/axiosInstance.js'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { login, fetchUser } from '../store/auth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(login())
      navigate('/')
    }
  }, [dispatch, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!password.trim()) {
      setError('Password is required')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/user/signin', {
        email,
        password
      })

      if (response.data.token) {
        // Store token and user info in localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('id', response.data.id)
        localStorage.setItem('role', response.data.role)

        // Admin override for hardcoded credentials
        if (email === 'admin@gmail.com' && password === 'admin123') {
          localStorage.setItem('role', 'admin');
          localStorage.setItem('user', JSON.stringify({email, role: 'admin'}));
        }

        // Dispatch login action to Redux
        dispatch(login())
        dispatch(fetchUser())

        setEmail('')
        setPassword('')
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900 text-white py-12 px-4'>
      <div className='max-w-md mx-auto mt-12'>
        <div className='bg-zinc-700 rounded-lg shadow-2xl p-8'>
          <h1 className='text-4xl font-bold text-center mb-2'>Login</h1>
          <p className='text-center text-gray-300 mb-8'>Welcome back to ByteBooks</p>

          {error && (
            <div className='bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 mb-6 text-red-200'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label className='block text-sm font-semibold mb-2' htmlFor='email'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={email}
                onChange={handleChange}
                placeholder='Enter your email'
                className='w-full px-4 py-3 bg-zinc-600 border border-zinc-500 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400'
              />
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-semibold mb-2' htmlFor='password'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  name='password'
                  value={password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                  className='w-full px-4 py-3 bg-zinc-600 border border-zinc-500 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-gray-400 hover:text-gray-200'
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-all duration-300 mb-4'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className='border-t border-zinc-600 my-6'></div>

          <p className='text-center text-gray-300'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-blue-400 hover:text-blue-300 font-semibold'>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
