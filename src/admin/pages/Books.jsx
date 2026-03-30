import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import BookForm from '../components/BookForm';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList, MdBook } from 'react-icons/md';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/book/get-books');
        setBooks(response.data.data || []);
      } catch (error) {
        toast.error('Failed to load books');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [refreshKey]);

  useEffect(() => {
    let filtered = [...books];

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((book) => (book.category || 'Uncategorized') === selectedCategory);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return a.title.localeCompare(b.title);
    });

    setFilteredBooks(filtered);
  }, [books, searchTerm, selectedCategory, sortBy]);

  const handleDelete = async (bookId) => {
    if (window.confirm('Delete this book?')) {
      try {
        await api.delete('/book/delete-book', {
          data: { bookId }
        });
        toast.success('Book deleted successfully!');
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const categories = ['all', 'Self Help', 'Fiction', 'Tech', 'Business', 'Finance'];

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-lg text-gray-500'>Loading books...</div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
          <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
            Book Management
          </h1>
          <span className='px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full w-fit'>
            {filteredBooks.length} books
          </span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto'
        >
          <MdAdd size={20} />
          Add New Book
        </button>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='relative'>
            <MdSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search by title or author...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='relative'>
            <MdFilterList className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none'
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='title'>Sort by Title</option>
              <option value='price'>Sort by Price</option>
            </select>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[760px]'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-6 py-5 text-left font-semibold text-gray-900 dark:text-white'>Image</th>
                <th className='px-6 py-5 text-left font-semibold text-gray-900 dark:text-white'>Title</th>
                <th className='px-6 py-5 text-left font-semibold text-gray-900 dark:text-white'>Author</th>
                <th className='px-6 py-5 text-left font-semibold text-gray-900 dark:text-white'>Price</th>
                <th className='px-6 py-5 text-left font-semibold text-gray-900 dark:text-white'>Language</th>
                <th className='px-6 py-5 text-right font-semibold text-gray-900 dark:text-white'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book._id} className='border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                    <td className='px-6 py-5'>
                      <img src={book.url || book.image || '/vite.svg'} alt={book.title} className='w-12 h-16 object-cover rounded-lg shadow-md' />
                    </td>
                    <td className='px-6 py-5 font-semibold text-gray-900 dark:text-white max-w-md truncate'>{book.title}</td>
                    <td className='px-6 py-5 text-gray-700 dark:text-gray-300'>{book.author}</td>
                    <td className='px-6 py-5 font-semibold text-green-600 dark:text-green-400'>${Number(book.price || 0).toFixed(2)}</td>
                    <td className='px-6 py-5 text-gray-700 dark:text-gray-300'>{book.language}</td>
                    <td className='px-6 py-5 text-right space-x-2'>
                      <button
                        onClick={() => setSelectedBook(book)}
                        className='p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-all'
                        title='Edit'
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className='p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all'
                        title='Delete'
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='px-6 py-12 text-center text-gray-500 dark:text-gray-400'>
                    <div className='flex flex-col items-center gap-2'>
                      <MdBook className='w-16 h-16 opacity-40 mx-auto mb-4' />
                      <h3 className='text-xl font-semibold'>No books found</h3>
                      <p>Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BookForm
        book={selectedBook}
        onClose={() => {
          setShowForm(false);
          setSelectedBook(null);
          setRefreshKey((prev) => prev + 1);
        }}
        isOpen={showForm || !!selectedBook}
      />
    </div>
  );
};

export default Books;
