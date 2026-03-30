import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const SignUp = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [role, setRole] = useState('user')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'username') setUsername(value)
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
    if (name === 'address') setAddress(value)
    if (name === 'role') setRole(value)
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    setSuccess('')

    // Validation
    if (!username.trim()) {
      newErrors.username = 'Username is required'
    } else if (username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
   

    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('/api/v1/user/signup', {
        username,
        email,
        password,
        address
      })

      setSuccess(response.data.message || 'Signup successful! Redirecting to login...')
      
      // Clear form
      setUsername('')
      setEmail('')
      setPassword('')
      setAddress('')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      const errMessage = err.response?.data?.message || 'An error occurred during signup'
      setErrors({ submit: errMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-900 text-white py-12 px-4'>
      <div className='max-w-md mx-auto mt-8'>
        <div className='bg-zinc-700 rounded-lg shadow-2xl p-8'>
          <h1 className='text-4xl font-bold text-center mb-2'>Sign Up</h1>
          <p className='text-center text-gray-300 mb-8'>Join ByteBooks today</p>

          {errors.submit && (
            <div className='bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 mb-6 text-red-200'>
              {errors.submit}
            </div>
          )}

          {success && (
            <div className='bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-3 mb-6 text-green-200'>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='mb-5'>
              <label className='block text-sm font-semibold mb-2' htmlFor='username'>
                Username
              </label>
              <input
                type='text'
                id='username'
                name='username'
                value={username}
                onChange={handleChange}
                placeholder='Choose a username'
                className='w-full px-4 py-2 bg-zinc-600 border border-zinc-500 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400'
              />
              {errors.username && (
                <p className='text-red-300 text-sm mt-1'>{errors.username}</p>
              )}
            </div>

            <div className='mb-5'>
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
                className='w-full px-4 py-2 bg-zinc-600 border border-zinc-500 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400'
              />
              {errors.email && (
                <p className='text-red-300 text-sm mt-1'>{errors.email}</p>
              )}
            </div>

            <div className='mb-5'>
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
                  placeholder='Create a password'
                  className='w-full px-4 py-2 bg-zinc-600 border border-zinc-500 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-2 text-gray-400 hover:text-gray-200'
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-300 text-sm mt-1'>{errors.password}</p>
              )}
            </div>

            <div className='mb-5'>
              <label className='block text-sm font-semibold mb-2' htmlFor='address'>
                Address
              </label>
              <input
                type='text'
                id='address'
                name='address'
                value={address}
                onChange={handleChange}
                placeholder='Enter your address'
                className='w-full px-4 py-2 bg-zinc-600 border border-zinc-500 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400'
              />
              {errors.address && (
                <p className='text-red-300 text-sm mt-1'>{errors.address}</p>
              )}
            </div>

            <div className='mb-5'>
              <label className='block text-sm font-semibold mb-2' htmlFor='role'>
                Register as
              </label>
              <select
                id='role'
                name='role'
                value={role}
                onChange={handleChange}
                className='w-full px-4 py-2 bg-zinc-600 border border-zinc-500 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400'
              >
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </select>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-all duration-300 mb-4'
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className='border-t border-zinc-600 my-6'></div>

          <p className='text-center text-gray-300'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-400 hover:text-blue-300 font-semibold'>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
