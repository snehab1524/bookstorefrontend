import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminNavbar from './components/AdminNavbar';
import { useAdmin } from './context/AdminContext';
import { useEffect } from 'react';

const AdminLayout = () => {
  const { state } = useAdmin();

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  return (
    <div className={`min-h-screen ${state.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AdminSidebar />

      <div className='ml-0 md:ml-64 transition-all duration-300'>
        <AdminNavbar />
        <main className='p-4 sm:p-6 md:p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
