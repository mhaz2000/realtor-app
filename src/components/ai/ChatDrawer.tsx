import { X } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  dir?: 'ltr' | 'rtl';
  children: ReactNode;
};

const ChatDrawer = ({ isOpen, onClose, dir = 'ltr', children }: Props) => {
  const sideClass = dir === 'rtl' ? 'left-0' : 'right-0';
  const { t } = useTranslation()

  return (
    <div
      className={`fixed top-0 ${sideClass} h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : dir === 'rtl' ? '-translate-x-full' : 'translate-x-full'
        }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">{t('ai_assistant')}</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">{children}</div>
    </div>
  );
};

export default ChatDrawer;
