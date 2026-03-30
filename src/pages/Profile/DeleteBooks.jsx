import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const DeleteBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/book/get-books');
        setBooks(response.data.data || []);
      } catch (error) {
        toast.error('Failed to load books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    if (role !== 'admin') {
      toast.error('Only admin can delete books');
      return;
    }

    if (window.confirm('Delete this book?')) {
      try {
        await api.delete('/book/delete-book', {
          data: { bookId }
        });
        toast.success('Book deleted!');
        setBooks((prev) => prev.filter((book) => book._id !== bookId));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error');
      }
    }
  };

  const filteredBooks = useMemo(
    () => books.filter((book) => book.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [books, searchTerm]
  );

  if (role !== 'admin') {
    return <div className='p-4 md:p-8 text-red-300'>Only admin can delete books.</div>;
  }

  if (loading) return <div className='p-4 md:p-8'>Loading books...</div>;

  return (
    <div className='bg-zinc-900 rounded-lg p-4 sm:p-6 md:p-8'>
      <h1 className='text-2xl font-bold mb-6'>Delete Books (Admin)</h1>
      <input
        type='text'
        placeholder='Search books to delete...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='w-full p-3 border border-zinc-600 bg-zinc-800 rounded mb-6 text-white'
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
        {filteredBooks.map((book) => (
          <div key={book._id} className='border border-zinc-700 p-4 rounded-lg bg-zinc-800'>
            <img src={book.url || book.image} alt={book.title} className='w-full h-48 object-cover rounded mb-2' />
            <h3 className='font-bold line-clamp-1'>{book.title}</h3>
            <p className='text-sm text-zinc-400 mb-2 line-clamp-1'>{book.author}</p>
            <p>Rs. {book.price}</p>
            <button
              onClick={() => handleDelete(book._id)}
              className='mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600'
            >
              Delete Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeleteBooks;
