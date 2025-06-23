import HouseListPage from '../components/house/HouseList';
import { useEffect } from 'react';
import { clearMessages } from '../utils/chatPersistence';

const Home = () => {

  useEffect(() => {
    clearMessages()
  }, [])

  return (
    <div className='p-4'>
      <HouseListPage />
    </ div>
  );
};

export default Home;
