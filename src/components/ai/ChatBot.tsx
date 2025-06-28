import { useState, useRef, useEffect } from 'react';
import { Check, Send, Clipboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ChatInput, ChatResponse } from '../../types/chatbot';
import { ask } from '../../api/chatbot';

import { loadMessages, saveMessages } from '../../utils/chatPersistence';

const ChatBot = ({
  containerHeight = 500,
}: {
  containerHeight?: number;
}) => {
  const headerHeight = 48;
  const inputHeight = 150;
  const messagesHeight = containerHeight - headerHeight - inputHeight;

  // Load messages from utility function
  const [messages, setMessages] = useState<{ from: 'user' | 'ai'; text: string }[]>(() =>
    loadMessages()
  );

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Save messages on every update
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const inputPayload: ChatInput = { message: trimmed };
      const response: ChatResponse = await ask(inputPayload);

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

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col h-full w-full max-h-full">
      <div
        className="overflow-y-auto bg-gray-100 p-4 rounded mb-2"
        style={{ height: messagesHeight > 0 ? messagesHeight : 300 }}
      >
        {messages.length === 0 ? (
          <p className="text-gray-500">{t('start_typing')}</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 flex ${
                msg.from === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="relative group max-w-[80%]">
                <div
                  className={`p-2 rounded-lg break-words text-lg ${
                    msg.from === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'
                  }`}
                >
                  {msg.text}
                </div>
                <button
                  className={`absolute ${
                    msg.from === 'user' ? 'end-0' : 'start-0'
                  } opacity-0 group-hover:opacity-100 transition-opacity`}
                  onClick={() => copyToClipboard(msg.text, idx)}
                  title="Copy"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clipboard className="w-4 h-4 text-blue-400 hover:text-blue-800" />
                  )}
                </button>
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

      <div className="shrink-0 pb-4">
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
    </div>
  );
};

export default ChatBot;
