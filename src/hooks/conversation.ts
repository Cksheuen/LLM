import { useState, useRef, useEffect } from "react";
import ConversationListEl from '@/type.d/Conversation'

export const useConversation = () => {

    const [conversation, setConversation] = useState<ConversationListEl>()

    useEffect(() => {
        console.log('conversation changed', conversation)
    }, [conversation])

    return {
        conversation,
        setConversation
    }
}