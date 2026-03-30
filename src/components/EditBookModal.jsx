import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import { useBooks } from '../context/BooksContext';

const EditBookModal = ({ isOpen, onClose, book }) => {
  const { updateBook, isAdmin } = useBooks();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        price: book.price || '',
        category: book.category || '',
        imageUrl: book.imageUrl || book.image || '',
      });
      setError('');
    }
  }, [isOpen, book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin || !book?._id) return;

    // Validation
    if (!formData.title.trim() || !formData.author.trim() || !formData.price || !formData.category.trim()) {
      setError('All fields except image are required');
      return;
    }

    try {
      setLoading(true);
      const updatedBook = { ...formData, _id: book._id };
      updateBook(updatedBook);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Book</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-400 rounded p-3 mb-4 text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-white">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-white">Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-white">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-white">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-white">Image URL (optional)</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isAdmin}
            className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaSave />
            {loading ? 'Saving...' : 'Update Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;

