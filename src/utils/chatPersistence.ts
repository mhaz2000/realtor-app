const STORAGE_KEY = 'chatbot_messages';

export const loadMessages = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const saveMessages = (messages: any[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
        // Ignore errors
    }
};

export const clearMessages = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // Ignore errors
    }
};
