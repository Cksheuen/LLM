import { SimpleBot } from "./bot"

export default interface ConversationListEl {
    title: string
    details: ConversationObj
    del: boolean
    add: boolean
}


export interface SpaceBotsAnimateCon {
    bot: SimpleBot
    del: boolean
    add: boolean
}

export interface ObjectStringObj {
    type: string
    text?: string
    file_id?: string
    file_url: string
}

export interface EnterMessageObj {
    role: string
    type?: string
    content?: string
    content_type?: string | ObjectStringObj
    meta_data: Map<string, string>
}

export interface CreateConversationData {
    messages?: EnterMessageObj
    meta_map?: Map<string, string>
}

export interface ConversationObj {
    id?: string
    created_at?: number
    meta_data?: Map<string, string>
}

export interface ConversationCreateResponse {
    code: number
    msg: string
    data: ConversationObj
}