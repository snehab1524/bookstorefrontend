import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axiosInstance.js';
import { FaHeart, FaRegHeart, FaShoppingCart, FaPlus } from 'react-icons/fa';
import { useFavorites } from '../../context/FavoritesContext';

const BookCard = ({ data }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isInCart, setIsInCart] = useState(false);
  const [favouriteLoading, setFavouriteLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const token = localStorage.getItem('token');

  const getImagePath = () => {
    if (data.url || data.image) return data.url || data.image;
    return 'https://via.placeholder.com/300x400?text=No+Image';
  };

  useEffect(() => {
    if (!token) return;

    const checkStatus = async () => {
      try {
        const cartRes = await api.get('/cart/get-user-cart');
        setIsInCart(cartRes.data.data.some((book) => book._id === data._id));
      } catch (error) {
        console.error('Cart status check failed:', error);
      }
    };

    checkStatus();
  }, [data._id, token]);

  const refetchCartStatus = async () => {
    if (!token) return;
    try {
      const cartRes = await api.get('/cart/get-user-cart');
      setIsInCart(cartRes.data.data.some((book) => book._id === data._id));
    } catch (error) {
      console.error('Refetch cart status failed:', error);
    }
  };

  const handleFavouriteToggle = () => {
    setFavouriteLoading(true);
    toggleFavorite(data);
    setFavouriteLoading(false);
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
        await api.delete(`/cart/remove/${data._id}`);
      } else {
        await api.post('/cart/add', { bookId: data._id });
      }
      await refetchCartStatus();
    } catch (error) {
      console.error('Cart error:', error);
      setIsInCart(prevCart);
      alert('Failed to update cart');
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className='bg-zinc-800 rounded-lg p-4 flex flex-col h-full border border-zinc-700'>
      <Link to={`/view-book-details/${data._id}`} className='block'>
        <div className='bg-zinc-900 rounded p-4 h-56 sm:h-60 md:h-64 flex items-center justify-center'>
          <img src={getImagePath()} alt={data.title} className='h-full w-full object-contain' />
        </div>
        <h2 className='mt-4 text-lg md:text-xl text-yellow-100 font-semibold line-clamp-2'>{data.title}</h2>
        <p className='mt-2 text-zinc-400 font-semibold line-clamp-1'>by {data.author}</p>
        <p className='mt-2 text-zinc-200 font-semibold text-lg md:text-xl'>Rs. {data.price}</p>
      </Link>
      <div className='flex justify-end gap-2 mt-3'>
        <button
          onClick={handleCartToggle}
          disabled={cartLoading}
          className={`p-2 rounded-full transition-all duration-300 border-2 flex-1 ${
            isInCart
              ? 'bg-yellow-500 text-zinc-900 border-yellow-500 hover:bg-yellow-600'
              : 'bg-transparent text-zinc-400 border-zinc-600 hover:text-yellow-400 hover:border-yellow-400'
          }`}
          title={isInCart ? 'Remove from cart' : 'Add to cart'}
        >
          {cartLoading ? (
            <div className='w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto'></div>
          ) : isInCart ? (
            <FaShoppingCart className='w-5 h-5 mx-auto' />
          ) : (
            <FaPlus className='w-5 h-5 mx-auto' />
          )}
        </button>
        <button
          onClick={handleFavouriteToggle}
          disabled={favouriteLoading}
          className={`p-2 rounded-full transition-all duration-300 border-2 flex-1 ${
            isFavorite(data._id)
              ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
              : 'bg-transparent text-zinc-400 border-zinc-600 hover:text-red-400 hover:border-red-400'
          }`}
          title={isFavorite(data._id) ? 'Remove from favourites' : 'Add to favourites'}
        >
          {favouriteLoading ? (
            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto'></div>
          ) : isFavorite(data._id) ? (
            <FaHeart className='w-4 h-4 mx-auto' />
          ) : (
            <FaRegHeart className='w-4 h-4 mx-auto' />
          )}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
