import React, { useState } from 'react'
import books from '../../assets/books.jpg'
import { Link, useNavigate } from 'react-router-dom'
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/auth.js';
import { FaShoppingCart, FaCrown } from 'react-icons/fa';


function Navbar() {
  const token = localStorage.getItem('token');
  const reduxLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartCount = useSelector((state) => state.cart.cartCount);
  const isLoggedIn = !!token && reduxLoggedIn;
  const role = localStorage.getItem('role') || 'user';
  const isAdminUser = role === 'admin';
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
    setIsMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/books', label: 'Books' }
  ];

  if (isLoggedIn) {
    navLinks.push(
      { to: '/profile', label: 'Profile' },
      { to: '/cart', label: cartCount > 0 ? `Cart (${cartCount})` : 'Cart' }
    );
  }

  const renderNavLinks = () => navLinks.map(({ to, label }) => (
    <Link
      key={to}
      to={to}
      className='transition-all duration-300 text-lg hover:text-blue-500'
      onClick={() => setIsMobileOpen(false)}
    >
      {label}
    </Link>
  ));

  return (
    <>
      <nav className='sticky top-0 z-50 flex bg-zinc-800 text-white py-2 items-center justify-between px-4 md:px-8 border-b border-zinc-700'>
        <Link className='flex items-center' to='/'>
          <img src={books} alt="Logo" className='w-12 h-12' />
          <h1 className='text-xl sm:text-2xl font-bold'>ByteBooks</h1>
        </Link>
        
        {/* Desktop nav */}
        <div className='hidden md:flex items-center gap-4'>
          <div className='flex gap-4'>
            {renderNavLinks()}
          </div>
          <div className='flex gap-4'>
            {isLoggedIn ? (
              <div className='flex items-center gap-2'>
                {isAdminUser && (
                  <div className='px-3 py-1 bg-yellow-500 text-zinc-900 rounded-full text-xs font-bold flex items-center gap-1'>
                    <FaCrown className='w-3 h-3' />
                    Admin Mode
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className='px-4 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-2'
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            ) : (

              <>
                <Link to="/login" className='px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'>LogIn</Link>
                <Link to="/signup" className='px-4 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'>SignUp</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          className='md:hidden text-white' 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <FaBars className='w-6 h-6' />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div className={`md:hidden bg-zinc-800 border-t border-zinc-700 ${isMobileOpen ? 'block' : 'hidden'} w-full z-40`}>
        <div className='flex flex-col items-center py-4 gap-4 text-lg'>
          {renderNavLinks()}
          {isLoggedIn ? (
            <div className='flex items-center gap-2'>
              {isAdminUser && (
                <div className='px-3 py-1 bg-yellow-500 text-zinc-900 rounded-full text-xs font-bold flex items-center gap-1'>
                  <FaCrown className='w-4 h-4' />
                  Admin Mode
                </div>
              )}
              <button 
                onClick={handleLogout}
                className='px-8 py-2 text-white font-semibold border border-red-500 rounded hover:bg-red-500 transition-all duration-300 flex items-center gap-2'
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className='px-8 py-2 font-semibold border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'
              >
                LogIn
              </Link>
              <Link 
                to="/signup" 
                className='px-8 py-2 font-semibold bg-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'
              >
                SignUp
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
