import HouseListPage from '../components/house/HouseList';
import AIAssistantModal from '../components/house/AIAssistantModal';
import { useState } from 'react';

const Home = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string | null>();

  return (
    <>
      <HouseListPage setIsOpen={setIsOpen} filterText={filter ?? ''} />
      <AIAssistantModal isOpen={isOpen} setIsOpen={setIsOpen} filter={filter ?? ''} setFilter={setFilter} />
    </>
  );
};

export default Home;
