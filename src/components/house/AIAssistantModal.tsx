import Modal from '../Modal';
import { useTranslation } from 'react-i18next';

type HouseAiFilter = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  filter: string | null;
  setFilter: (value: string) => void;
}

const AIAssistantModal = ({ isOpen, setIsOpen, filter, setFilter }: HouseAiFilter) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Floating Button */}


      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">{t('ai_assistant')}</h2>

        <textarea
          placeholder={t('searchByAI')}
          value={filter ?? ''}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mt-4 h-60"
        />
      </Modal>
    </>
  );
};

export default AIAssistantModal;
