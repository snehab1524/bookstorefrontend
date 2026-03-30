import React from 'react'
import api from '../../utils/axiosInstance.js';
import BookCard from '../BookCard/BookCard';
import Loader from '../Loader/Loader';


const RecentlyAdded = () => {
    const [Data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      let isMounted = true;

      const fetchRecentlyAdded = async () => {
        try {
          setIsLoading(true);
          const response = await api.get('/book/recently-added');
          if (isMounted) {
            setData(response.data.data || []);
          }
        } catch (error) {
          console.error('Failed to fetch recently added books:', error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      fetchRecentlyAdded();

      return () => {
        isMounted = false;
      };
    }, []);

  return (
    <div className='mt-8 px-0 sm:px-1'>
        <h4 className='text-xl font-semibold text-yellow-100'>Recently Added Books</h4>
        {isLoading && <div className='flex justify-center items-center my-8'><Loader /></div>}
        <div className='my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {Data && Data.map((items,i) => (
                <div key={i}>
                    <BookCard data={items}/>
                    </div>
            
            ))}
        </div>
      
    </div>
  )
}

export default RecentlyAdded
