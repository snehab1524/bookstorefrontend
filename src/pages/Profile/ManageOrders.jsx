import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/axiosInstance';
import Loader from '../../components/Loader/Loader';
import { MdOutlinePerson, MdEmail, MdHome, MdFingerprint, MdExpandMore, MdExpandLess } from 'react-icons/md';

const ORDER_STATUSES = ['Order Placed', 'Shipped', 'Delivered', 'Cancelled'];

const statusColor = (status) => {
  if (status === 'Order Placed') return 'bg-yellow-500';
  if (status === 'Shipped') return 'bg-blue-500';
  if (status === 'Delivered') return 'bg-green-500';
  if (status === 'Cancelled') return 'bg-red-500';
  return 'bg-zinc-500';
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [expandedUserInfo, setExpandedUserInfo] = useState(new Set());
  const role = localStorage.getItem('role');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/order/get-all-orders');
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [role]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const keyword = searchTerm.trim().toLowerCase();
      const orderCode = order._id?.slice(-6).toLowerCase() || '';
      const userName = order.user?.username?.toLowerCase() || '';
      const userEmail = order.user?.email?.toLowerCase() || '';
      const userAddress = order.user?.address?.toLowerCase() || '';
      const matchesSearch =
        !keyword ||
        orderCode.includes(keyword) ||
        userName.includes(keyword) ||
        userEmail.includes(keyword) ||
        userAddress.includes(keyword);
      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc.total += 1;
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      { total: 0, 'Order Placed': 0, Shipped: 0, Delivered: 0, Cancelled: 0 }
    );
  }, [orders]);

  const toggleExpand = (orderId) => {
    const next = new Set(expandedOrders);
    if (next.has(orderId)) next.delete(orderId);
    else next.add(orderId);
    setExpandedOrders(next);
  };

  const toggleUserInfo = (orderId) => {
    const next = new Set(expandedUserInfo);
    if (next.has(orderId)) next.delete(orderId);
    else next.add(orderId);
    setExpandedUserInfo(next);
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      const response = await api.put(`/order/update-order-status/${orderId}`, { status });
      const updated = response.data?.data;
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: updated?.status || status } : order
        )
      );
      toast.success('Order status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId('');
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  if (role !== 'admin') {
    return <div className='p-8 text-red-300'>Only admin can manage orders.</div>;
  }

  if (loading) return <Loader />;

  return (
    <div className='bg-zinc-900 min-h-screen p-4 md:p-8'>
      <h2 className='text-2xl md:text-3xl font-semibold text-yellow-100 mb-6'>
        Manage Orders - All User Placed Orders ({filteredOrders.length})
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6'>
        <div className='bg-zinc-800 border border-zinc-700 rounded p-3 text-zinc-200 text-sm'>Total: {statusCounts.total}</div>
        <div className='bg-zinc-800 border border-zinc-700 rounded p-3 text-yellow-300 text-sm'>Placed: {statusCounts['Order Placed']}</div>
        <div className='bg-zinc-800 border border-zinc-700 rounded p-3 text-blue-300 text-sm'>Shipped: {statusCounts.Shipped}</div>
        <div className='bg-zinc-800 border border-zinc-700 rounded p-3 text-green-300 text-sm'>Delivered: {statusCounts.Delivered}</div>
        <div className='bg-zinc-800 border border-zinc-700 rounded p-3 text-red-300 text-sm'>Cancelled: {statusCounts.Cancelled}</div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-6'>
        <input
          type='text'
          placeholder='Search by order id, username, email, address'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='bg-zinc-800 border border-zinc-700 rounded p-3 text-white'
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='bg-zinc-800 border border-zinc-700 rounded p-3 text-white'
        >
          <option value='all'>All Statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button onClick={fetchOrders} className='bg-blue-600 hover:bg-blue-700 text-white rounded p-3'>
          Refresh Orders
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className='text-zinc-300'>No orders found.</div>
      ) : (
        <div className='space-y-4'>
          {filteredOrders.map((order) => (
            <div key={order._id} className='bg-zinc-800 rounded-xl p-4 sm:p-5 border border-zinc-700'>
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3'>
                <div>
                  <h3 className='text-lg font-semibold text-yellow-100'>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className='text-zinc-500 text-xs'>Placed on {formatDate(order.createdAt)}</p>
                </div>

                <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                  <span className='text-yellow-100 font-bold'>Rs. {(order.totalAmount || 0).toFixed(2)}</span>
                  <span className={`px-3 py-1 rounded-full text-xs text-white ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => toggleUserInfo(order._id)}
                    className='text-zinc-200 text-sm border border-zinc-600 rounded px-3 py-2 hover:bg-zinc-700 flex items-center gap-1'
                    title='Toggle user information'
                  >
                    <MdOutlinePerson className='w-4 h-4' />
                    User Info
                    {expandedUserInfo.has(order._id) ? <MdExpandLess className='w-4 h-4' /> : <MdExpandMore className='w-4 h-4' />}
                  </button>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className='bg-zinc-700 text-white border border-zinc-600 rounded px-3 py-2 text-sm'
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className='text-zinc-200 text-sm border border-zinc-600 rounded px-3 py-2 hover:bg-zinc-700'
                  >
                    {expandedOrders.has(order._id) ? 'Hide Items' : 'View Items'}
                  </button>
                </div>
              </div>

              {expandedUserInfo.has(order._id) && (
                <div className='mt-4 p-3 rounded-lg bg-zinc-900/60 border border-zinc-700'>
                  <div className='flex items-center gap-2 text-zinc-100 mb-2'>
                    <MdOutlinePerson className='w-5 h-5 text-blue-300' />
                    <p className='text-sm font-semibold'>User Information</p>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm'>
                    <p className='text-zinc-300 flex items-center gap-2 break-all'>
                      <MdOutlinePerson className='w-4 h-4 text-zinc-400' />
                      Name: <span className='text-white'>{order.user?.username || 'Unknown'}</span>
                    </p>
                    <p className='text-zinc-300 flex items-center gap-2 break-all'>
                      <MdEmail className='w-4 h-4 text-zinc-400' />
                      Email: <span className='text-white'>{order.user?.email || 'No email'}</span>
                    </p>
                    <p className='text-zinc-300 flex items-center gap-2 break-all md:col-span-2'>
                      <MdHome className='w-4 h-4 text-zinc-400' />
                      Address: <span className='text-white'>{order.user?.address || 'Not available'}</span>
                    </p>
                    <p className='text-zinc-400 flex items-center gap-2 break-all md:col-span-2 text-xs'>
                      <MdFingerprint className='w-4 h-4 text-zinc-500' />
                      User ID: {order.user?._id || 'N/A'}
                    </p>
                  </div>
                </div>
              )}

              {expandedOrders.has(order._id) && (
                <div className='mt-4 space-y-2'>
                  {order.books?.map((item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className='flex justify-between text-sm text-zinc-300 border-t border-zinc-700 pt-2 gap-3'
                    >
                      <span className='line-clamp-1'>
                        {item.book?.title || 'Book'} x{item.quantity}
                      </span>
                      <span className='whitespace-nowrap'>
                        Rs. {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
