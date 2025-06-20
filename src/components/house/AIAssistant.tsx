import { useEffect, useState } from 'react';
import { Resizable } from 're-resizable';
import { Bot, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ChatBot from '../ai/ChatBot';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const { i18n, t } = useTranslation();
  const dir = i18n.dir();

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize(); // initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const defaultWidth = Math.min(windowSize.width * 0.4, 400);
  const defaultHeight = Math.min(windowSize.height * 0.6, 500);

  useEffect(() => {
    if (isOpen) {
      setContainerSize({ width: defaultWidth, height: defaultHeight });
    }
  }, [isOpen, defaultWidth, defaultHeight]);

  return (
    <div
      className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50`}
    >
      {!isOpen ? (
        <button
          className="p-3 bg-blue-600 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="w-6 h-6 text-white" />
        </button>
      ) : (
        <Resizable
          defaultSize={{ width: defaultWidth, height: defaultHeight }}
          minWidth={Math.min(windowSize.width * 0.2, 280)}
          minHeight={300}
          maxWidth={Math.min(windowSize.width * 0.6, 800)}
          maxHeight={Math.min(windowSize.height * 0.8, 700)}
          className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col"
          enable={{
            top: false,
            right: true,
            bottom: true,
            left: false,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          onResizeStop={(_e, _direction, ref) => {
            setContainerSize({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            });
          }}
        >
          <div className="flex items-center justify-between p-3 bg-blue-600 text-white">
            <div className="flex items-center gap-2 font-semibold">
              <Bot size={20} />
              <span>{t('ai_assistant')}</span>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 p-2">
            <ChatBot containerHeight={containerSize.height} />
          </div>
        </Resizable>
      )}
    </div>
  );
};

export default AIAssistant;
