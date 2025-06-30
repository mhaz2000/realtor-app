export const formatChatText = (text: string): string => {
  // Escape HTML
  const escaped = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold **text**
  const bolded = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Linkify URLs
  const linked = bolded.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" class="text-blue-600 underline hover:text-blue-800">$1</a>'
  );

  // Line breaks
  const formatted = linked
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  return formatted;
};
