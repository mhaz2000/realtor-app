import HouseListPage from '../components/house/HouseList';
import AIAssistant from '../components/house/AIAssistant';
import { useEffect } from 'react';
import { clearMessages } from '../utils/chatPersistence';

const Home = () => {

  useEffect(() => {
    clearMessages()
  }, [])
  return (
    <>
      <HouseListPage />
      <AIAssistant />
    </>
  );
};

export default Home;
