import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { MdPeople, MdBook, MdAttachMoney, MdShoppingCart, MdArrowDropUp } from 'react-icons/md';

const Dashboard = () => {
  const { state } = useAdmin();

  const recentOrders = state.orders.slice(0, 5);

  const topBooks = useMemo(() => {
    const sales = {};
    state.orders.forEach((order) => {
      order.books.forEach((book) => {
        sales[book.bookId] = (sales[book.bookId] || 0) + book.quantity;
      });
    });

    return Object.entries(sales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, quantity]) => ({
        id: parseInt(id, 10),
        title: state.books.find((b) => b.id === parseInt(id, 10))?.title || 'Unknown',
        quantity
      }));
  }, [state.orders, state.books]);

  const chartData = [1200, 1500, 1800, 1400, 2000, 2200];

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-8'>
        <h1 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
          Dashboard
        </h1>
        <div className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit'>Welcome back, Admin!</div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Total Books</p>
              <p className='text-3xl font-bold text-gray-900 dark:text-white'>{state.stats.totalBooks}</p>
            </div>
            <MdBook className='w-12 h-12 text-blue-500' />
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Total Users</p>
              <p className='text-3xl font-bold text-gray-900 dark:text-white'>{state.stats.totalUsers}</p>
            </div>
            <MdPeople className='w-12 h-12 text-green-500' />
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400 mb-1'>Total Orders</p>
              <p className='text-3xl font-bold text-gray-900 dark:text-white'>{state.stats.totalOrders}</p>
            </div>
            <MdShoppingCart className='w-12 h-12 text-sky-500' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium mb-1 opacity-90'>Total Revenue</p>
              <p className='text-3xl font-bold'>${state.stats.totalRevenue.toFixed(2)}</p>
              <p className='text-sm opacity-90 mt-1'>+12.5% from last month</p>
            </div>
            <MdAttachMoney className='w-12 h-12 opacity-90' />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>Recent Orders</h2>
              <Link to='/admin/orders' className='text-blue-500 hover:text-blue-600 font-medium text-sm'>View All</Link>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full min-w-[640px]'>
                <thead>
                  <tr className='border-b border-gray-200 dark:border-gray-700'>
                    <th className='text-left py-4 font-semibold text-gray-900 dark:text-white'>Order ID</th>
                    <th className='text-left py-4 font-semibold text-gray-900 dark:text-white'>Customer</th>
                    <th className='text-left py-4 font-semibold text-gray-900 dark:text-white'>Status</th>
                    <th className='text-left py-4 font-semibold text-gray-900 dark:text-white'>Total</th>
                    <th className='text-left py-4 font-semibold text-gray-900 dark:text-white'>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                      <td className='py-4 font-medium'>#{order.id}</td>
                      <td className='py-4'>{order.userName}</td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : order.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className='py-4 font-semibold text-gray-900 dark:text-white'>${order.total.toFixed(2)}</td>
                      <td className='py-4 text-sm text-gray-500'>{new Date(order.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 lg:sticky lg:top-24'>
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Top Selling</h2>
            <div className='space-y-4'>
              {topBooks.map((book, index) => (
                <div key={book.id} className='flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl'>
                  <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                    {index + 1}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-gray-900 dark:text-white truncate'>{book.title}</p>
                    <p className='text-sm text-gray-500'>{book.quantity} sold</p>
                  </div>
                  <MdArrowDropUp className='text-green-500 w-5 h-5' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>Revenue Trend (6 Months)</h2>
        </div>
        <div className='flex items-end gap-2 h-56 sm:h-64 mb-4'>
          {chartData.map((value, index) => (
            <div
              key={index}
              className='flex-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all relative group cursor-pointer'
              style={{ height: `${(value / Math.max(...chartData)) * 100}%` }}
              title={`$${value.toLocaleString()}K`}
            >
              <div className='absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white font-bold'>
                ${value / 1000}K
              </div>
            </div>
          ))}
        </div>
        <p className='text-center text-sm text-gray-500 dark:text-gray-400'>Overall +25% growth</p>
      </div>
    </div>
  );
};

export default Dashboard;
