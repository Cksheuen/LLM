import { post } from "./request";
import { CreateChatParams } from "@/type.d/chat";

export const createChat = ({
    conversation_id, bot_id, user_id, additional_messages, custom_variables, auto_save_history, meta_data, extra_params
}: CreateChatParams) =>
    post(`/v3/chat?conversation_id=${conversation_id}`, {
        bot_id, user_id, additional_messages, stream: false, custom_variables, auto_save_history, meta_data, extra_params
    });

export const createChatStream = ({
    conversation_id, bot_id, user_id, additional_messages, custom_variables, auto_save_history, meta_data, extra_params
}: CreateChatParams) =>
    post<string>(`/v3/chat${conversation_id ? `?conversation_id=${conversation_id}` : ''}`, {
        bot_id, user_id, additional_messages, stream: true, custom_variables, auto_save_history, meta_data, extra_params
    });