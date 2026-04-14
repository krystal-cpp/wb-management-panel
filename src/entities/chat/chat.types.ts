export interface ChatGoodCard {
    date: string,
    nmID: number,
    price: number,
    priceCurrency: string,
    rid: string,
    size: string,
    statusID: number,
};

export interface ChatLastMessage {
    text: string,
    addTimestamp: number,
};

export interface Chat {
    chatID: string,
    replySign: string,
    clientID: string,
    clientName: string,
    goodCard: ChatGoodCard | null,
    lastMessage: ChatLastMessage | null,
};

export interface ChatsResponse {
    result: Chat[],
    errors: null,
};

export interface MessageGoodCard {
    date: string,
    nmID: number,
    price: number,
    priceCurrency: string,
    rid: string,
    size: string,
    statusID: number,
};

export interface MessageFile {
    contentType: string,
    date: string,
    downloadID: string,
    name: string,
    url: string,
    size: number,
};

export interface MessageImage {
    date: string,
    downloadID: string,
    url: string,
};

export interface MessageAttachments {
    goodCard?: MessageGoodCard,
    files?: MessageFile[],
    images?: MessageImage[],
};

export interface ChatMessage {
    attachments?: MessageAttachments,
    text: string,
};

export interface ChatEvent {
    chatID: string,
    eventID: string,
    eventType: string,
    isNewChat?: boolean,
    message: ChatMessage,
    source?: string,
    addTimestamp: number,
    addTime: string,
    replySign?: string,
    sender: 'client' | 'seller',
    clientID?: string,
    clientName?: string,
};

export interface ChatEventsResponse {
    result: {
        next: number,
        newestEventTime: string,
        oldestEventTime: string,
        totalEvents: number,
        events: ChatEvent[],
    },
    errors: null,
};

export interface SendMessagePayload {
    replySign: string,
    message: string,
};