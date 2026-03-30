import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { MdNotifications, MdSearch, MdDarkMode, MdLightMode, MdAccountCircle } from 'react-icons/md';

const AdminNavbar = () => {
  const { state, dispatch } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className='bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <div className='flex items-center gap-3 flex-1 pl-12 md:pl-0'>
            <div className='relative flex-1 max-w-md hidden sm:block'>
              <MdSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Search books, orders, users...'
                className='w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white'
              />
            </div>
            <button className='relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all'>
              <MdNotifications size={20} />
              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                3
              </span>
            </button>
          </div>

          <div className='flex items-center gap-2 sm:gap-4'>
            <button
              onClick={() => dispatch({ type: 'SET_DARK_MODE', payload: !state.darkMode })}
              className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all'
              title='Toggle Dark Mode'
            >
              {state.darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
            </button>

            <Link to='/admin/settings' className='flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900'>
              <MdAccountCircle size={24} />
              <span className='hidden sm:inline'>Admin</span>
            </Link>

            <button
              onClick={handleLogout}
              className='px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-all'
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
