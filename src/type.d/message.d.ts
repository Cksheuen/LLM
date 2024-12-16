export interface MessageObj {
    id: string;
    conversation_id: string;
    bot_id: string;
    chat_id: string;
    meta_data: Map<string, string>;
    role: string;
    content: string;
    content_type: string;
    created_at: number;
    updated_at: number;
    type: string;
}

export interface GetMessageListParams {
    conversation_id: string;
    order?: string;
    chat_id?: string;
    before_id?: string;
    after_id?: string;
    limit?: number;
}

export interface CreateMessageParams {
    conversation_id: string;
    role: string;
    content: string;
    content_type: string;
    meta_data?: Map<string, string>;
}