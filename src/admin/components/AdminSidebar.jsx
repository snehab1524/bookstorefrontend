import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdBook,
  MdShoppingCart,
  MdPeople,
  MdCategory,
  MdRateReview,
  MdAnalytics,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose
} from 'react-icons/md';

const sidebarNav = [
  { icon: MdDashboard, path: '/admin/dashboard', label: 'Dashboard' },
  { icon: MdBook, path: '/admin/books', label: 'Books' },
  { icon: MdShoppingCart, path: '/admin/orders', label: 'Orders' },
  { icon: MdPeople, path: '/admin/users', label: 'Users' },
  { icon: MdCategory, path: '/admin/categories', label: 'Categories' },
  { icon: MdRateReview, path: '/admin/reviews', label: 'Reviews' },
  { icon: MdAnalytics, path: '/admin/analytics', label: 'Analytics' },
  { icon: MdSettings, path: '/admin/settings', label: 'Settings' }
];

const AdminSidebar = () => {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className='md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white shadow-lg'
        aria-label='Open menu'
      >
        <MdMenu size={24} />
      </button>

      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden ${isMobileOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside
        className={`bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-all duration-300 h-screen fixed left-0 top-0 z-50
        ${isDesktopCollapsed ? 'md:w-20' : 'md:w-64'}
        w-64
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className='p-6 border-b border-gray-700'>
          <div className={`flex items-center gap-3 ${isDesktopCollapsed ? 'md:justify-center' : ''}`}>
            <div className='w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>B</span>
            </div>
            {!isDesktopCollapsed && (
              <div>
                <h1 className='text-xl font-bold'>ByteBooks Admin</h1>
                <p className='text-sm text-gray-400'>Dashboard</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className='md:hidden absolute top-6 right-4 p-1 hover:bg-gray-700 rounded'
            aria-label='Close menu'
          >
            <MdClose className='w-6 h-6' />
          </button>

          <button
            onClick={() => setIsDesktopCollapsed((prev) => !prev)}
            className='hidden md:block absolute top-6 right-4 p-1 hover:bg-gray-700 rounded'
            aria-label='Toggle desktop collapse'
          >
            {isDesktopCollapsed ? <MdMenu className='w-5 h-5' /> : <MdClose className='w-5 h-5' />}
          </button>
        </div>

        <nav className='p-4 mt-6 h-[calc(100vh-170px)] overflow-y-auto'>
          <ul className='space-y-2'>
            {sidebarNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive ? 'bg-blue-500 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
                    } ${isDesktopCollapsed ? 'md:justify-center' : ''}`}
                  >
                    <Icon size={22} />
                    {!isDesktopCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className='absolute bottom-6 left-0 right-0 px-4 pb-4'>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/30 transition-all duration-200 text-left'
          >
            <MdLogout size={22} />
            {!isDesktopCollapsed && <span>Logout</span>}
          </button>
          {!isDesktopCollapsed && <div className='text-xs text-gray-500 mt-2 text-center'>Admin Panel v1.0</div>}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
