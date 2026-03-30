import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaHeart, FaPlus, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import Loader from '../Loader/Loader';
import api from '../../utils/axiosInstance.js';
import { useFavorites } from '../../context/FavoritesContext';

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [Data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    description: '',
    language: 'English',
    price: '',
    url: ''
  });

  const { isFavorite, toggleFavorite } = useFavorites();
  const [isInCart, setIsInCart] = useState(false);
  const [favouriteLoading, setFavouriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const role = localStorage.getItem('role') || 'user';

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!id) {
          setIsLoading(false);
          return;
        }

        const response = await api.get(`/book/get-book-by-id/${id}`);
        const book = response.data.data;
        setData(book || {});
        setEditForm({
          title: book?.title || '',
          author: book?.author || '',
          description: book?.description || '',
          language: book?.language || 'English',
          price: book?.price || '',
          url: book?.url || ''
        });
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [id]);

  useEffect(() => {
    if (!token || !Data?._id) return;

    const checkCartStatus = async () => {
      try {
        const cartRes = await api.get('/cart/get-user-cart');
        setIsInCart(cartRes.data.data.some((book) => book._id === Data._id));
      } catch (error) {
        console.error('Cart status check failed:', error);
        setIsInCart(false);
      }
    };

    checkCartStatus();
  }, [Data?._id, token]);

  const refetchCartStatus = async () => {
    if (!token) return;
    try {
      const cartRes = await api.get('/cart/get-user-cart');
      setIsInCart(cartRes.data.data.some((book) => book._id === Data._id));
    } catch (error) {
      console.error('Refetch cart status failed:', error);
    }
  };

  const handleCartToggle = async () => {
    if (!token) {
      alert('Please login to add to cart');
      return;
    }

    setCartLoading(true);
    const prevCart = isInCart;
    setIsInCart(!isInCart);

    try {
      if (prevCart) {
        await api.delete(`/cart/remove/${Data._id}`);
      } else {
        await api.post('/cart/add', { bookId: Data._id });
      }
      await refetchCartStatus();
    } catch (error) {
      console.error('Cart error:', error);
      setIsInCart(prevCart);
      alert('Failed to update cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  const handleFavouriteToggle = () => {
    setFavouriteLoading(true);
    toggleFavorite(Data);
    setFavouriteLoading(false);
  };

  const handleDeleteBook = async () => {
    if (role !== 'admin') {
      alert('Admin only');
      return;
    }

    if (!window.confirm('Delete this book?')) return;

    try {
      setAdminLoading(true);
      await api.delete('/book/delete-book', {
        data: { bookId: Data._id }
      });
      alert('Book deleted successfully');
      navigate('/books');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete book');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();

    if (role !== 'admin') {
      alert('Admin only');
      return;
    }

    if (!editForm.title.trim() || !editForm.author.trim() || Number(editForm.price) <= 0) {
      alert('Please provide valid title, author and price');
      return;
    }

    try {
      setAdminLoading(true);
      await api.put('/book/update-book', {
        bookId: Data._id,
        title: editForm.title.trim(),
        author: editForm.author.trim(),
        description: editForm.description.trim(),
        language: editForm.language.trim(),
        price: Number(editForm.price),
        url: editForm.url.trim()
      });

      setData((prev) => ({
        ...prev,
        ...editForm,
        price: Number(editForm.price)
      }));
      setIsEditing(false);
      alert('Book updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update book');
    } finally {
      setAdminLoading(false);
    }
  };

  const getImagePath = () => {
    if (Data.url) return Data.url;
    return 'https://via.placeholder.com/300x400?text=No+Image';
  };

  if (isLoading) return <Loader />;
  if (!id || !Data?._id) {
    return <div className='bg-zinc-900 text-white px-4 md:px-8 py-8 min-h-screen'>Book not found.</div>;
  }

  return (
    <div className='bg-zinc-900 text-white px-4 md:px-8 py-4 md:py-8 flex flex-col md:flex-row gap-4 md:gap-8 min-h-screen'>
      <div className='bg-zinc-800 rounded p-4 w-full md:w-1/2 order-1 md:order-1 flex items-center justify-center'>
        <img src={getImagePath()} alt='book' className='h-64 md:h-[60vh] lg:h-[70vh] w-auto object-contain' />
      </div>

      <div className='p-4 w-full md:w-1/2 order-2 md:order-2'>
        {isEditing ? (
          <form onSubmit={handleUpdateBook} className='space-y-3'>
            <input
              type='text'
              placeholder='Title'
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className='w-full p-2 rounded text-black'
              required
            />
            <input
              type='text'
              placeholder='Author'
              value={editForm.author}
              onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
              className='w-full p-2 rounded text-black'
              required
            />
            <textarea
              rows={4}
              placeholder='Description'
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className='w-full p-2 rounded text-black'
              required
            />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <input
                type='text'
                placeholder='Language'
                value={editForm.language}
                onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                className='w-full p-2 rounded text-black'
                required
              />
              <input
                type='number'
                step='0.01'
                placeholder='Price'
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                className='w-full p-2 rounded text-black'
                required
              />
            </div>
            <input
              type='url'
              placeholder='Image URL'
              value={editForm.url}
              onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
              className='w-full p-2 rounded text-black'
            />

            <div className='flex gap-3'>
              <button
                type='submit'
                disabled={adminLoading}
                className='bg-yellow-500 text-zinc-900 px-4 py-2 rounded font-semibold hover:bg-yellow-600 transition disabled:opacity-50'
              >
                {adminLoading ? 'Updating...' : 'Save Changes'}
              </button>
              <button
                type='button'
                onClick={() => setIsEditing(false)}
                className='bg-zinc-700 text-white px-4 py-2 rounded font-semibold hover:bg-zinc-600 transition'
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className='text-xl md:text-2xl lg:text-3xl font-semibold text-yellow-100'>{Data.title}</h2>
            <p className='mt-2 text-zinc-400 font-semibold'>by {Data.author}</p>
            <p className='mt-2 text-zinc-400 font-semibold'>{Data.description}</p>
            <p className='mt-2 text-zinc-400 font-semibold'>{Data.language}</p>
            <p className='mt-2 md:mt-4 text-zinc-200 font-semibold text-lg md:text-xl lg:text-2xl'>Rs. {Data.price}</p>
          </>
        )}

        {isLoggedIn ? (
          <div className='mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 items-center'>
            <button
              onClick={handleCartToggle}
              disabled={cartLoading}
              className={`px-4 py-2 rounded font-semibold transition-all duration-300 border-2 flex-1 ${
                isInCart
                  ? 'bg-yellow-500 text-zinc-900 border-yellow-500 hover:bg-yellow-600 shadow-lg shadow-yellow-500/50'
                  : 'bg-transparent text-zinc-400 border-zinc-600 hover:text-yellow-400 hover:border-yellow-400'
              } ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {cartLoading ? (
                <div className='w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto'></div>
              ) : isInCart ? (
                <FaShoppingCart className='w-5 h-5 mx-auto' />
              ) : (
                <FaPlus className='w-5 h-5 mx-auto' />
              )}
            </button>

            <button
              onClick={handleFavouriteToggle}
              disabled={favouriteLoading}
              className={`p-3 rounded-full transition-all duration-300 border-2 ${
                isFavorite(Data._id)
                  ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50'
                  : 'bg-transparent text-zinc-400 border-zinc-600 hover:text-red-400 hover:border-red-400'
              } ${favouriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isFavorite(Data._id) ? 'Remove from favourites' : 'Add to favourites'}
            >
              {favouriteLoading ? (
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              ) : isFavorite(Data._id) ? (
                <FaHeart className='w-5 h-5' />
              ) : (
                <FaRegHeart className='w-5 h-5' />
              )}
            </button>
          </div>
        ) : (
          <p className='mt-4 md:mt-6 text-zinc-400'>Please login to manage cart and favourites</p>
        )}

        {role === 'admin' && !isEditing && (
          <div className='mt-4 md:mt-6 flex flex-col sm:flex-row gap-3 items-center'>
            <button
              onClick={() => setIsEditing(true)}
              className='bg-yellow-500 text-zinc-900 px-4 py-2 rounded font-semibold hover:bg-yellow-600 transition flex-1 flex items-center gap-2'
            >
              <FaEdit />
              Edit
            </button>
            <button
              onClick={handleDeleteBook}
              disabled={adminLoading}
              className='bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 transition flex-1 flex items-center gap-2 disabled:opacity-50'
            >
              <MdDeleteForever />
              {adminLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBookDetails;
