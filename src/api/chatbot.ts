import type { ChatInput, ChatResponse } from "../types/chatbot";
import { authorizedAxios } from "./axios";

export const ask = async (input: ChatInput): Promise<ChatResponse> => {
    const { data } = await authorizedAxios.post<ChatResponse>('chatbot/ask', input);
    return data;
};
