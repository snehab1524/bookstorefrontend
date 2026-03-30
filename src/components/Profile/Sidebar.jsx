import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/auth.js';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className='bg-zinc-800 p-4 rounded flex flex-col lg:sticky lg:top-24'>
      <div className='flex items-center flex-col justify-center'>
        <div className='w-24 h-24 rounded-full mb-4 bg-zinc-700 flex items-center justify-center text-2xl font-bold'>
          {data.username?.[0] || 'U'}
        </div>
        <h2 className='text-lg sm:text-xl font-bold mb-2 break-all text-center'>{data?.username || 'User'}</h2>
        <p className='text-sm text-gray-400 mb-4 break-all text-center'>{data?.email || 'email@example.com'}</p>
        <div className='w-full mt-2 h-px bg-zinc-500'></div>
      </div>

      <nav className='w-full flex flex-wrap lg:flex-col mt-4 gap-2'>
        <Link to='/profile/favourites' className='block py-2 px-4 rounded hover:bg-zinc-700'>
          Favourites
        </Link>

        {role !== 'admin' && (
          <Link to='/profile/orderHistory' className='block py-2 px-4 rounded hover:bg-zinc-700'>
            Order History
          </Link>
        )}

        {role === 'admin' && (
          <>
            <Link to='/profile/manage-orders' className='block py-2 px-4 rounded hover:bg-zinc-700'>
              Manage Orders
            </Link>
            <Link to='/profile/add-books' className='block py-2 px-4 rounded hover:bg-zinc-700'>
              Add Books
            </Link>
            <Link to='/profile/update-books' className='block py-2 px-4 rounded hover:bg-zinc-700'>
              Update Books
            </Link>
            <Link to='/profile/delete-books' className='block py-2 px-4 rounded hover:bg-zinc-700'>
              Delete Books
            </Link>
          </>
        )}

        <Link to='/profile/settings' className='block py-2 px-4 rounded hover:bg-zinc-700'>
          Settings
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className='w-full py-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white mt-4'
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
