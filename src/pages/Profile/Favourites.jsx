import React, { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';

const Favourites = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [selectedBooks, setSelectedBooks] = useState(new Set());

  const toggleSelect = (bookId) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const removeSelected = () => {
    if (selectedBooks.size === 0) {
      return;
    }

    for (const bookId of selectedBooks) {
      removeFavorite(bookId);
    }

    setSelectedBooks(new Set());
  };

  return (
    <div className='bg-zinc-900 min-h-screen p-4 md:p-8'>
      <h2 className='text-2xl md:text-3xl font-semibold text-yellow-100 mb-6'>
        Your Favourites ({favorites.length})
      </h2>

      {favorites.length === 0 ? (
        <p className='text-zinc-400 text-center py-12'>No favourite books yet. Add some from the Books page!</p>
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
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
              {favorites.map((book) => (
                <div key={book._id} className='relative bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700'>
                  <input
                    type='checkbox'
                    checked={selectedBooks.has(book._id)}
                    onChange={() => toggleSelect(book._id)}
                    className='absolute top-2 left-2 z-10 w-5 h-5 text-blue-600 bg-zinc-700 border-zinc-600 rounded'
                  />
                  <img src={book.url || book.image} alt={book.title} className='w-full h-56 object-cover' />
                  <div className='p-4'>
                    <h3 className='font-semibold line-clamp-1'>{book.title}</h3>
                    <p className='text-zinc-400 text-sm line-clamp-1'>by {book.author}</p>
                    <p className='text-lg font-bold text-yellow-100 mt-1'>Rs. {book.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
