import { create } from 'zustand'
import { devtools, persist } from "zustand/middleware";
import ConversationListEl from '@/type.d/Conversation';

interface ConversationStateList {
    conversationList: ConversationListEl[]
    addNewConversationEl: (new_el: ConversationListEl) => void
    delConversationEl: (index: number) => void
    setAddAttribute: (new_add: boolean, index: number) => void
    setDelAttribute: (new_del: boolean, index: number) => void
}

export const useConversationListStore = create<ConversationStateList>()(
  devtools(
    persist(
      (set) => ({
        conversationList: [],
        addNewConversationEl: (newEl: ConversationListEl) => set((state) => ({
            conversationList: [...state.conversationList, newEl]
        })),
        delConversationEl: (index: number) => set((state) => ({
            conversationList: state.conversationList.filter((_, i) => i !== index)
        })),
        setAddAttribute: (newAdd: boolean, index: number) => set((state) => ({
            conversationList: state.conversationList.map((el, i) => 
                i === index ? { ...el, add: newAdd } : el
            )
        })),
        setDelAttribute: (newDel: boolean, index: number) => set((state) => ({
            conversationList: state.conversationList.map((el, i) => 
                i === index ? { ...el, del: newDel } : el
            )
        }))
      }),
      {
        name: "conversation-list",
      }
    )
  )
)