import React, { useState } from 'react';
import api from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const AddBooks = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    language: 'English',
    url: ''
  });
  const [loading, setLoading] = useState(false);
  const role = localStorage.getItem('role');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== 'admin') {
      toast.error('Only admin can add books');
      return;
    }

    try {
      setLoading(true);
      await api.post('/book/add-book', {
        title: formData.title,
        author: formData.author,
        price: parseFloat(formData.price),
        description: formData.description,
        language: formData.language,
        url: formData.url
      });
      toast.success('Book added!');
      setFormData({ title: '', author: '', price: '', description: '', language: 'English', url: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'admin') {
    return <div className='p-4 md:p-8 text-red-300'>Only admin can add books.</div>;
  }

  return (
    <div className='bg-zinc-900 rounded-lg p-4 sm:p-6 md:p-8'>
      <h1 className='text-2xl font-bold mb-6'>Add New Book</h1>
      <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-2xl'>
        <input type='text' placeholder='Title' value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-800 rounded text-white' required />
        <input type='text' placeholder='Author' value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-800 rounded text-white' required />
        <input type='number' placeholder='Price' value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-800 rounded text-white' required />
        <input type='text' placeholder='Description' value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-800 rounded text-white' required />
        <input type='text' placeholder='Language' value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-800 rounded text-white' />
        <input type='url' placeholder='Image URL' value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-800 rounded text-white' />
        <button type='submit' disabled={loading} className='w-full sm:w-auto bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600'>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBooks;
