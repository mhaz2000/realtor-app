import { useState, useRef, useEffect } from 'react';
import {
  Clipboard,
  Check,
  Send,
  Home,
  Ruler,
  Building2,
  Eye,
  CalendarDays,
  BadgeDollarSign,
  Landmark,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ChatInput, ChatResponse } from '../../types/chatbot';
import { ask } from '../../api/chatbot';

import { loadMessages, saveMessages } from '../../utils/chatPersistence';
import { formatChatText } from '../../utils/formatChatText';


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
  const { t, i18n } = useTranslation();
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

      // Save the entire response object in the `text` field as JSON string
      setMessages((prev) => [
        ...prev,
        { from: 'ai', text: JSON.stringify(response) },
      ]);
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
          messages.map((msg, idx) => {
            const isUser = msg.from === 'user';
            let content;

            if (!isUser) {
              let parsed: ChatResponse | null = null;

              try {
                parsed = JSON.parse(msg.text);
              } catch {
                // fallback to plain text
              }

              if (parsed && typeof parsed === 'object' && 'description' in parsed) {
                content = (
                  <div className="space-y-2">
                    <div
                      className="text-base"
                      dangerouslySetInnerHTML={{ __html: formatChatText(parsed.description) }}
                    />
                    {parsed.has_units && parsed.unit_result.length > 0 && (
                      <div className="space-y-4 mt-2">
                        {parsed.unit_result.map((unit, i) => (
                          <div
                            key={i}
                            className="border p-3 rounded-lg shadow-sm bg-white transition-all hover:shadow-md"
                            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                          >
                            <a
                              href={unit.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-lg font-semibold flex items-center gap-2"
                            >
                              <Home className="w-5 h-5" />
                              {unit.unit_info.project_name}
                            </a>
                            <ul className="mt-2 text-sm text-gray-700 space-y-2">
                              <li className="flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-purple-600" />
                                {t('area')}: {unit.unit_info.total_area.toLocaleString(i18n.language)} m²
                              </li>
                              <li className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-orange-500" />
                                {t('type')}: {unit.unit_info.unit_type}
                              </li>
                              <li className="flex items-center gap-2">
                                <Landmark className="w-4 h-4 text-blue-500" />
                                {t('floor')}: {unit.unit_info.floor}
                              </li>
                              <li className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-pink-600" />
                                {t('view')}: {unit.unit_info.view}
                              </li>
                              <li className="flex items-center gap-2">
                                <BadgeDollarSign className="w-4 h-4 text-green-600" />
                                {t('price')}: {unit.unit_info.full_payment.toLocaleString(i18n.language)} {i18n.language === 'ar' ? 'جنيه' : 'EGP'}
                              </li>
                              <li className="flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-red-500" />
                                {t('completion')}: {unit.unit_info.completion_date}
                              </li>
                            </ul>

                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                );
              } else {
                content = (
                  <div
                    className="text-base"
                    dangerouslySetInnerHTML={{ __html: formatChatText(msg.text) }}
                  />
                );
              }
            } else {
              content = (
                <div
                  className="text-base"
                  dangerouslySetInnerHTML={{ __html: formatChatText(msg.text) }}
                />
              );
            }

            return (
              <div
                key={idx}
                className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="relative group max-w-[80%]">
                  <div
                    className={`p-2 rounded-lg break-words text-lg ${isUser ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'
                      }`}
                  >
                    {content}
                  </div>
                  <button
                    className={`absolute ${isUser ? 'end-0' : 'start-0'
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
            );
          })
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
