import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  RefObject,
} from 'react';
import LLMAnswer from '@/components/LLM/LLMAnswer';
import LLMAsk from '@/components/LLM/LLMAsk';
import style from './index.module.css';
import { useConversationStore } from '@/store/conversation';
import { getMessageList } from '@/api/message';
import { MessageObj } from '@/type.d/message';
import { StreamChat } from '@/type.d/chat';
import { UseCreateConversation } from '@/hooks/conversation';

interface LLMConversationProps {
  streamChatRef: RefObject<(streamChats: StreamChat[]) => void | null>;
  userAddNewChatRef: RefObject<(newMessage: MessageObj) => void | null>;
}

export default function LLMConversation({
  streamChatRef,
  userAddNewChatRef,
}: LLMConversationProps) {
  const container = useRef<HTMLDivElement>(null);
  const conversation = useConversationStore((state) => state.conversation);
  const selectedBotId = useConversationStore((state) => state.selectedBotId);
  const sendMsgByHook = UseCreateConversation().sendMessage;
  const [messages, setMessages] = useState<MessageObj[]>([]);
  const getMessageListFunc = async () => {
    const res = await getMessageList({
      conversation_id: conversation!.details.id!,
    });
    if (res.data.length > 0)
      setMessages(res.data.sort((a, b) => a.created_at - b.created_at));
    else {
      const newMessage = {
        id: '123',
        conversation_id: conversation!.details.id!,
        bot_id: selectedBotId!.bot_id!,
        chat_id: '123',
        role: 'user',
        content: conversation!.title,
        content_type: 'text',
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        type: 'question',
      } as MessageObj;
      setMessages((prev) => [...prev, newMessage]);
      const streamChats = await sendMsgByHook(
        conversation!.title,
        conversation!.details.id!,
        selectedBotId!.bot_id!,
      );
      setNewChatContent(streamChats);
    }
  };
  const [newChatContent, setNewChatContent] = useState<StreamChat[] | null>(
    null,
  );

  useEffect(() => {
    if (conversation) {
      getMessageListFunc();
    }
  }, [conversation]);

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight;
    }
  }, [messages, newChatContent]);

  const setScrollBar = () => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight;
    }
  };

  const completeAddNewChat = (newMessage: MessageObj) => {
    setMessages((prev) => [...prev, newMessage]);
    setNewChatContent(null);
  };

  useImperativeHandle(streamChatRef, () => (streamChats: StreamChat[]) => {
    setNewChatContent(streamChats);
  });

  useImperativeHandle(userAddNewChatRef, () => (newMessage: MessageObj) => {
    setMessages((prev) => [...prev, newMessage]);
  });

  return (
    <div
      ref={container}
      className={`w-full flex-grow overflow-x-clip overflow-y-scroll ${style.scroll_bar} ${style.container}`}
    >
      <div
        // ref={container}
        className={`flex w-full flex-col items-center gap-10 pr-5 sm:p-10 md:p-20 lg:p-10 ${style.scroll_bar}`}
      >
        {messages.map((message, index) =>
          message.role === 'user' ? (
            <LLMAsk key={index} content={message.content} />
          ) : (
            <LLMAnswer key={index} content={message.content} />
          ),
        )}
        {newChatContent && (
          <LLMAnswer
            streamChats={newChatContent}
            setScrollBar={setScrollBar}
            completeAddNewChat={completeAddNewChat}
          />
        )}
      </div>
    </div>
  );
}
