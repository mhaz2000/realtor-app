import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ChatInput, ChatResponse } from '../../types/chatbot';
import { ask } from '../../api/chatbot';

const ChatBot = () => {
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

 const handleSend = async () => {
  const trimmed = input.trim();
  if (!trimmed) return;

  // Immediately add user message
  setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
  setInput('');
  setLoading(true);

  try {
    const inputPayload: ChatInput = { message: trimmed };
    const response: ChatResponse = await ask(inputPayload);

    // Only add AI response (user message already added)
    setMessages((prev) => [...prev, { from: 'ai', text: response.response }]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { from: 'ai', text: t('error_occurred') || 'An error occurred' },
    ]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 rounded mb-2">
        {messages.length === 0 ? (
          <p className="text-gray-500">{t('start_typing')}</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.from === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block p-2 rounded-lg max-w-[80%] ${
                  msg.from === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="text-left mb-2">
            <div className="inline-block bg-white border p-2 rounded-lg max-w-[80%] text-gray-500 italic">
              {t('loading') || 'Thinking...'}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={5}
          className="flex-1 resize-none border rounded px-3 py-2 max-h-[120px] overflow-y-auto"
          placeholder={t('type_here') ?? 'Type here...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-600 rounded text-white disabled:opacity-50"
          disabled={loading}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
