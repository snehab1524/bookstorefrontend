import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../utils/axiosInstance';
import { fetchUser } from '../../store/auth';

const Settings = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [address, setAddress] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
    }
  }, [user]);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;

    setUpdating(true);
    setUpdateMessage('');

    try {
      await api.put('/user/update-address', { address: address.trim() });
      await dispatch(fetchUser());
      setUpdateMessage('Address updated successfully!');
    } catch (error) {
      setUpdateMessage(error.response?.data?.message || 'Failed to update address. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[300px] bg-zinc-900 p-4 sm:p-8 rounded-lg'>
        <div className='text-lg'>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className='bg-zinc-900 p-4 sm:p-6 md:p-8 rounded-lg min-h-[300px]'>
      <h1 className='text-2xl font-bold mb-6 text-white'>Settings</h1>

      {updateMessage && (
        <div
          className={`p-4 rounded mb-4 ${
            updateMessage.includes('success') ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {updateMessage}
        </div>
      )}

      {user ? (
        <div className='space-y-6'>
          <div className='bg-zinc-800 p-4 sm:p-6 rounded-lg'>
            <h2 className='text-xl font-semibold mb-4 text-white'>Profile Information</h2>
            <div className='space-y-2 text-gray-300 break-all'>
              <p>
                <span className='font-medium'>Username:</span> {user.username}
              </p>
              <p>
                <span className='font-medium'>Email:</span> {user.email}
              </p>
              <p>
                <span className='font-medium'>Current Address:</span> {user.address || 'Not set'}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateAddress} className='bg-zinc-800 p-4 sm:p-6 rounded-lg'>
            <h2 className='text-xl font-semibold mb-4 text-white'>Update Address</h2>
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='w-full p-3 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[100px]'
                placeholder='Enter your address'
                disabled={updating}
              />
            </div>
            <button
              type='submit'
              disabled={updating || !address.trim()}
              className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors'
            >
              {updating ? 'Updating...' : 'Update Address'}
            </button>
          </form>
        </div>
      ) : (
        <div className='text-center py-12 text-gray-400'>No user data available. Please log in.</div>
      )}
    </div>
  );
};

export default Settings;
