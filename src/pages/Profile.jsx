import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Profile/Sidebar';
import Loader from '../components/Loader/Loader';


const Profile = () => {
  const { user, loading, error } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className='bg-zinc-900 px-3 sm:px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row min-h-screen py-4 md:py-8 gap-4 text-white'>
        <div className='w-full lg:w-1/4 xl:w-1/5'>
          <Sidebar data={{}} />
        </div>
        <div className='w-full lg:w-3/4 xl:w-4/5 flex items-center justify-center'>
          <Loader />
        </div>
      </div>
    );
  }

  if (loading || error || !user) {
    return (
      <div className='bg-zinc-900 px-3 sm:px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row min-h-screen py-4 md:py-8 gap-4 text-white'>
        <div className='w-full lg:w-1/4 xl:w-1/5'>
          <Sidebar data={{}} />
        </div>
        <div className='w-full lg:w-3/4 xl:w-4/5 flex items-center justify-center text-red-400'>
          Please log in to view profile.
        </div>
      </div>
    );
  }

  return (
    <div className='bg-zinc-900 px-3 sm:px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row min-h-screen py-4 md:py-8 gap-4 text-white'>
      <div className='w-full lg:w-1/4 xl:w-1/5'>
        <Sidebar data={user} />
      </div>
      <div className='w-full lg:w-3/4 xl:w-4/5'>
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
