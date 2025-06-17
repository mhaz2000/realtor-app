import { useTranslation } from 'react-i18next';
import { Bot } from 'lucide-react';
import { useState } from 'react';
import ChatDrawer from '../ai/ChatDrawer';
import ChatBot from '../ai/ChatBot';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <>
      <button
        className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-40`}
        onClick={() => setIsOpen(true)}
      >
        <div className="p-3 bg-blue-600 rounded-full shadow-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
      </button>

      <ChatDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} dir={dir}>
        <ChatBot />
      </ChatDrawer>
    </>
  );
};

export default AIAssistant;
