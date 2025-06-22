import HouseListPage from '../components/house/HouseList';
import { useEffect } from 'react';
import { clearMessages } from '../utils/chatPersistence';

const Home = () => {

  useEffect(() => {
    clearMessages()
  }, [])

  return (
    <>
      <HouseListPage />
    </>
  );
};

export default Home;
