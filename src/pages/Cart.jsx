import React, { useState, useEffect } from 'react';
import api from '../utils/axiosInstance.js';
import Loader from '../components/Loader/Loader.jsx';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartBooks, setCartBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [selectedBooks, setSelectedBooks] = useState(new Set());

  const fetchCart = async () => {
    if (!token || !isLoggedIn) {
      setIsLoading(false);
      setCartBooks([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get('/cart/get-user-cart');
      setCartBooks(response.data.data || []);
      setSelectedBooks(new Set());
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, isLoggedIn]);

  const toggleSelect = (bookId) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBooks.size === cartBooks.length) {
      setSelectedBooks(new Set());
      return;
    }

    setSelectedBooks(new Set(cartBooks.map((book) => book._id)));
  };

  const removeSelected = async () => {
    if (selectedBooks.size === 0) {
      return;
    }

    try {
      for (const bookId of selectedBooks) {
        await api.delete(`/cart/remove/${bookId}`);
      }
      setSelectedBooks(new Set());
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove selected books:', error);
    }
  };

  const placeOrder = async () => {
    if (selectedBooks.size === 0) {
      alert('Please select books to order');
      return;
    }

    try {
      const orderBooks = Array.from(selectedBooks).map((bookId) => {
        const book = cartBooks.find((b) => b._id === bookId);
        return {
          _id: book._id,
          title: book.title,
          price: book.price,
          author: book.author
        };
      });

      await api.post('/order/place-order', { order: orderBooks });
      alert('Order placed successfully!');
      setSelectedBooks(new Set());
      await fetchCart();
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (isLoading) return <Loader />;

  const selectedBooksArray = cartBooks.filter((book) => selectedBooks.has(book._id));
  const totalPrice = selectedBooksArray.reduce((total, book) => total + Number(book.price || 0), 0);

  return (
    <div className='bg-zinc-900 min-h-screen p-4 md:p-8'>
      <h2 className='text-2xl md:text-3xl font-semibold text-yellow-100 mb-6'>
        Shopping Cart ({cartBooks.length} items)
      </h2>

      {cartBooks.length === 0 ? (
        <p className='text-zinc-400 text-center py-12'>
          Your cart is empty.{' '}
          <Link to='/books' className='text-blue-400 hover:underline'>
            Add some books!
          </Link>
        </p>
      ) : (
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='lg:flex-1'>
            <div className='mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4'>
              <button
                onClick={removeSelected}
                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full sm:w-auto'
              >
                Remove Selected ({selectedBooks.size})
              </button>
              <button
                onClick={handleSelectAll}
                className='bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600 transition w-full sm:w-auto'
              >
                {selectedBooks.size === cartBooks.length ? 'Clear Selection' : 'Select All'}
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {cartBooks.map((book) => (
                <div key={book._id} className='flex items-center gap-3 sm:gap-4 p-4 bg-zinc-800 rounded-lg'>
                  <input
                    type='checkbox'
                    checked={selectedBooks.has(book._id)}
                    onChange={() => toggleSelect(book._id)}
                    className='w-5 h-5 text-blue-600 bg-zinc-700 border-zinc-600 rounded'
                  />
                  <img
                    src={book.url || book.image}
                    alt={book.title}
                    className='w-16 h-20 sm:w-20 sm:h-24 object-cover rounded'
                  />
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold line-clamp-1'>{book.title}</h3>
                    <p className='text-zinc-400 text-sm line-clamp-1'>by {book.author}</p>
                    <p className='text-lg font-bold text-yellow-100'>Rs. {book.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='lg:w-80'>
            <div className='bg-zinc-800 rounded-lg p-6 lg:sticky lg:top-24'>
              <h3 className='text-xl font-semibold mb-4'>Cart Summary</h3>
              <div className='space-y-3 mb-6'>
                <div className='flex justify-between'>
                  <span>Subtotal ({selectedBooks.size} items):</span>
                  <span>Rs. {totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={placeOrder}
                disabled={selectedBooks.size === 0}
                className='w-full bg-green-500 text-white py-3 rounded-lg font-semibold text-center hover:bg-green-600 disabled:bg-gray-500 transition-all duration-300'
              >
                Place Order ({selectedBooks.size} items, Rs. {totalPrice.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
