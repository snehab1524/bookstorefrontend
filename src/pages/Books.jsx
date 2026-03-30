import React from 'react'
import BookCard from '../components/BookCard/BookCard'
import Loader from '../components/Loader/Loader'
import api from '../utils/axiosInstance.js';

const Books = () => {
  const [Data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/book/get-books');
        if (isMounted) {
          setData(response.data.data || []);
        }
      } catch (error) {
        console.error('Failed to load books:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddBook = () => {
    if (localStorage.getItem('role') === 'admin') {
      alert('Admin add book feature');
    } else {
      alert('Admin only');
    }
  };

  return (
    <div className='bg-zinc-900 min-h-screen px-4 md:px-8 py-4 md:py-8'>
      <div className='flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-3'>
        <h4 className='text-xl font-semibold text-yellow-100'>All Books</h4>
        <button
          onClick={handleAddBook}
          className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold w-full sm:w-auto'
        >
          Add Book
        </button>
      </div>
      {isLoading && (
        <div className='flex justify-center items-center my-8'>
          <Loader />
        </div>
      )}
      <div className='my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {Data.map((items, i) => (
          <div key={i}>
            <BookCard data={items} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Books

