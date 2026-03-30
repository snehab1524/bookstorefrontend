import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosInstance.js';
import Loader from '../../components/Loader/Loader';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const { isLoggedIn } = useSelector((state) => state.auth);

  const fetchOrders = async () => {
    if (!token || !isLoggedIn) {
      setIsLoading(false);
      setOrders([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get('/order/get-order-history');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, isLoggedIn]);

  const toggleExpand = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'bg-yellow-500',
      Shipped: 'bg-blue-500',
      Delivered: 'bg-green-500',
      Cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  if (role === 'admin') {
    return (
      <div className='bg-zinc-900 min-h-screen p-4 md:p-8'>
        <h2 className='text-2xl md:text-3xl font-semibold text-yellow-100 mb-4'>Order History</h2>
        <p className='text-zinc-300'>
          Admin order history is managed in{' '}
          <Link to='/profile/manage-orders' className='text-blue-400 hover:underline'>
            Manage Orders
          </Link>
          .
        </p>
      </div>
    );
  }

  if (isLoading) return <Loader />;

  return (
    <div className='bg-zinc-900 min-h-screen p-4 md:p-8'>
      <h2 className='text-2xl md:text-3xl font-semibold text-yellow-100 mb-6'>Order History ({orders.length})</h2>

      {orders.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-zinc-400 mb-8'>
            <p className='text-xl mb-4'>No orders yet</p>
            <Link to='/books' className='text-blue-400 hover:underline font-semibold'>
              Start shopping!
            </Link>
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          {orders.map((order) => (
            <div key={order._id} className='bg-zinc-800 rounded-xl shadow-lg overflow-hidden'>
              <div className='p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-gradient-to-r from-zinc-700 to-zinc-800'>
                <div>
                  <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-yellow-100'>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className='text-zinc-400 text-sm'>Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className='flex flex-wrap items-center gap-2 sm:gap-4'>
                  <span className='text-xl lg:text-2xl font-bold text-yellow-100'>
                    Rs. {(order.totalAmount || 0).toFixed(2)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className='text-zinc-300 hover:text-white transition-all duration-200 px-3 py-2 border border-zinc-600 rounded-lg hover:border-zinc-400 text-sm'
                  >
                    {expandedOrders.has(order._id) ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {expandedOrders.has(order._id) && (
                <div className='p-4 sm:p-6 divide-y divide-zinc-700'>
                  <h4 className='text-lg font-semibold mb-4 text-zinc-200'>
                    Books in this order ({order.books.length})
                  </h4>
                  <div className='space-y-4'>
                    {order.books.map((bookItem, index) => (
                      <div key={index} className='flex items-center gap-3 sm:gap-4 p-4 bg-zinc-700 rounded-lg'>
                        <img
                          src={bookItem.book?.url || bookItem.book?.image}
                          alt={bookItem.book?.title}
                          className='w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg shadow-md'
                        />
                        <div className='flex-1 min-w-0'>
                          <h5 className='font-semibold text-white truncate'>{bookItem.book?.title || 'N/A'}</h5>
                          <p className='text-zinc-400 text-sm'>by {bookItem.book?.author || 'Unknown'}</p>
                        </div>
                        <div className='text-right'>
                          <p className='text-base sm:text-lg font-bold text-yellow-100'>
                            Rs. {(bookItem.price * bookItem.quantity).toFixed(2)}
                          </p>
                          <p className='text-zinc-400 text-sm'>Qty: x{bookItem.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
