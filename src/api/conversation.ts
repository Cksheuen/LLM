import { post } from "./request";
import { CreateConversationData, ConversationObj } from '@/type.d/Conversation';

export const createConversation = (data?: CreateConversationData) =>
    post<ConversationObj>('/v1/conversation/create', data);

export const getConversation = (conversation_id: string) =>
    post<ConversationObj>('/v1/conversation/retrieve', { conversation_id });