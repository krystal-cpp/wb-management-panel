import axios from "axios";
import type { ChatsResponse, ChatEventsResponse, SendMessagePayload } from '@/entities/chat';
import { mockChatEvents, mockChatsResponse } from "@/mocks/chats";

const USE_MOCK = true;

const chatsClient = axios.create({
    baseURL: 'https://buyer-chat-api.wildberries.ru',
    headers: {
        Authorization: process.env.WB_API_TOKEN ?? '',
    },
});

export async function getChats(): Promise<ChatsResponse> {
    if (USE_MOCK) return mockChatsResponse;

    const { data } = await chatsClient.get<ChatsResponse>('/api/v1/seller/chats');

    return data;
};

export async function getChatEvents(chatID: string): Promise<ChatEventsResponse> {
    if (USE_MOCK) return mockChatEvents[chatID] ?? { result: { next: 0, newestEventTime: '', oldestEventTime: '', totalEvents: 0, events: [] }, errors: null };

    const { data } = await chatsClient.get<ChatEventsResponse>('/api/v1/seller/events');

    return data;
};

export async function sendMessage(payload: SendMessagePayload): Promise<void> {
    if (USE_MOCK) return;

    const formData = new FormData();

    formData.append('replySign', payload.replySign);
    formData.append('message', payload.message);

    await chatsClient.post('/api/v1/seller/message', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};