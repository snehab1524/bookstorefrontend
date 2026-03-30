import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const emptyForm = {
  title: '',
  author: '',
  price: '',
  description: '',
  language: 'English',
  url: ''
};

const UpdateBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
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

  const filteredBooks = useMemo(
    () =>
      books.filter((book) => {
        const query = searchTerm.toLowerCase();
        return book.title?.toLowerCase().includes(query) || book.author?.toLowerCase().includes(query);
      }),
    [books, searchTerm]
  );

  const selectedBook = useMemo(() => books.find((book) => book._id === selectedBookId) || null, [books, selectedBookId]);

  const handleSelectBook = (book) => {
    setSelectedBookId(book._id);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      price: String(book.price ?? ''),
      description: book.description || '',
      language: book.language || 'English',
      url: book.url || book.image || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) {
      toast.error('Select a book to update');
      return;
    }

    try {
      setSaving(true);
      await api.put('/book/update-book', {
        bookId: selectedBook._id,
        title: formData.title.trim(),
        author: formData.author.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        language: formData.language.trim(),
        url: formData.url.trim()
      });

      setBooks((prev) =>
        prev.map((book) =>
          book._id === selectedBook._id
            ? {
                ...book,
                ...formData,
                price: Number(formData.price)
              }
            : book
        )
      );
      toast.success('Book updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update book');
    } finally {
      setSaving(false);
    }
  };

  if (role !== 'admin') {
    return <div className='p-4 md:p-8 text-red-300'>Only admin can update books.</div>;
  }

  if (loading) {
    return <div className='p-4 md:p-8'>Loading books...</div>;
  }

  return (
    <div className='bg-zinc-900 rounded-lg p-4 sm:p-6 md:p-8'>
      <h1 className='text-2xl font-bold mb-6'>Update Books (Admin)</h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div>
          <input
            type='text'
            placeholder='Search by title or author...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full p-3 border border-zinc-600 bg-zinc-800 rounded mb-4 text-white'
          />
          <div className='max-h-[520px] overflow-y-auto space-y-3 pr-1'>
            {filteredBooks.map((book) => (
              <button
                key={book._id}
                type='button'
                onClick={() => handleSelectBook(book)}
                className={`w-full text-left p-4 rounded border transition ${
                  selectedBookId === book._id
                    ? 'border-blue-500 bg-zinc-700'
                    : 'border-zinc-600 bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                <p className='font-semibold text-white'>{book.title}</p>
                <p className='text-sm text-zinc-300'>{book.author}</p>
              </button>
            ))}
            {!filteredBooks.length && <p className='text-zinc-300'>No books found.</p>}
          </div>
        </div>

        <div className='bg-zinc-800 p-4 sm:p-6 rounded'>
          <h2 className='text-xl font-semibold mb-4'>
            {selectedBook ? `Editing: ${selectedBook.title}` : 'Select a book to edit'}
          </h2>
          <form onSubmit={handleSubmit} className='space-y-3'>
            <input type='text' placeholder='Title' value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-900 rounded text-white' disabled={!selectedBook} required />
            <input type='text' placeholder='Author' value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-900 rounded text-white' disabled={!selectedBook} required />
            <input type='number' step='0.01' placeholder='Price' value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-900 rounded text-white' disabled={!selectedBook} required />
            <input type='text' placeholder='Language' value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-900 rounded text-white' disabled={!selectedBook} required />
            <input type='url' placeholder='Image URL' value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-900 rounded text-white' disabled={!selectedBook} />
            <textarea placeholder='Description' value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className='w-full p-3 border border-zinc-600 bg-zinc-900 rounded text-white' rows='5' disabled={!selectedBook} required />
            <button
              type='submit'
              disabled={!selectedBook || saving}
              className='w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {saving ? 'Updating...' : 'Update Book'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBooks;
