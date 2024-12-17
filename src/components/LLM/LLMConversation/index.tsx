import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  RefObject,
} from 'react';
import LLMQA from '../LLMQA';
import LLMAnswer from '@/components/LLM/LLMAnswer';
import LLMAsk from '@/components/LLM/LLMAsk';
import style from './index.module.css';
import { useConversationStore } from '@/store/conversation';
import { getMessageList } from '@/api/message';
import { useConversation } from '@/hooks/conversation';
import { getConversation } from '@/api/conversation';
import { MessageObj } from '@/type.d/message';
import { StreamChat } from '@/type.d/chat';

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
  const [messages, setMessages] = useState<MessageObj[]>([]);
  const getMessageListFunc = async () => {
    const res = await getMessageList({
      conversation_id: conversation?.details.id!,
    });
    setMessages(res.data.sort((a, b) => a.created_at - b.created_at));
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
    console.log('get stream chats', streamChats);
    setNewChatContent(streamChats);
  });

  useImperativeHandle(userAddNewChatRef, () => (newMessage: MessageObj) => {
    setMessages((prev) => [...prev, newMessage]);
  });

  /* const acquireConversation = async () => {
    const res = getConversation()
    console.log(res);
  }

  useEffect(() => {

  }) */

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
