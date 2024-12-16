import { create } from 'zustand'
import { devtools, persist } from "zustand/middleware";
import ConversationListEl from '@/type.d/Conversation';
import { SimpleBot } from '@/type.d/bot';

interface ConversationState {
  conversation: ConversationListEl | null
  selectedBotId: SimpleBot | null
  setConversation: (newConversation: ConversationListEl) => void
  setBotId: (newBotId: SimpleBot) => void
}

export const useConversationStore = create<ConversationState>()(
  devtools(
    persist(
      (set) => ({
        conversation: null,
        selectedBotId: null,
        setConversation: (newConversation: ConversationListEl) => set({ conversation: newConversation }),
        setBotId: (newBotId: SimpleBot) => set({ selectedBotId: newBotId })
      }),
      {
        name: "conversation",
      }
    )
  )
)