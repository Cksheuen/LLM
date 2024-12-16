import { post } from "./request";
import {
    MessageObj,
    GetMessageListParams,
    CreateMessageParams
} from "@/type.d/message";


export const createMessage = ({
    conversation_id, role, content, content_type, meta_data
}: CreateMessageParams) =>
    post<MessageObj>(`/v1/conversation/message/create?conversation_id=${conversation_id}`, {
        conversation_id, role, content, content_type, meta_data
    })

export const getMessageList = ({
    conversation_id, order, chat_id, before_id, after_id, limit
}: GetMessageListParams) =>
    post<MessageObj[]>(`/v1/conversation/message/list?conversation_id=${conversation_id}`, {
        conversation_id, order, chat_id, before_id, after_id, limit
    })