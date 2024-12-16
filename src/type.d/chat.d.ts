import { EnterMessageObj } from "./Conversation";

export interface CreateChatParams {
    conversation_id?: string;
    bot_id: string;
    user_id: string;
    additional_messages?: EnterMessageObj[];
    stream?: boolean;
    custom_variables?: Map<string, string>;
    auto_save_history?: boolean;
    meta_data?: Map<string, string>;
    extra_params?: Map<string, string>;
}

interface ToolCalls {
    id: string;
    type: string;
    function: {
        name: string;
        arguments: string
    }
}

interface ChatObj {
    id: string;
    conversation_id: string;
    bot_id: string;
    created_at?: number;
    completed_at?: number;
    failed_at?: number;
    meta_data?: Map<string, string>;
    last_error?: object;
    status: string;
    required_action?: {
        type: string;
        submit_tool_outputs: {
            tool_calls: ToolCalls[]
        }
    }
    usage: {
        token_usage: number;
        outpot_count: number;
        input_count: number;
    }
}

interface MessageObj {
    id: string;
    conversation_id: string;
    bot_id: string;
    chat_id: string;
    meta_data?: Map;
    role: string;
    content: string;
    content_type: string;
    created_at: number;
    updated_at: number;
    type: string;
}

export interface StreamChat {
    event: string | null;
    data: ChatObj | MessageObj | null
    [key: string]: string | ChatObj | MessageObj | null
}