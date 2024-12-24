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
import { LazyLoading } from '@/components/LoadingAnimation/LazyLoading';

interface LLMConversationProps {
  streamChatRef: RefObject<(streamChats: StreamChat[]) => void | null>;
  userAddNewChatRef: RefObject<(newMessage: MessageObj) => void | null>;
  setLoadingNewAnimation: RefObject<(loading: boolean) => void | null>;
}

export default function LLMConversation({
  streamChatRef,
  userAddNewChatRef,
  setLoadingNewAnimation,
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

      setStartNew(true);
      const streamChats = await sendMsgByHook(
        conversation!.title,
        conversation!.details.id!,
        selectedBotId!.bot_id!,
      );
      setStartNew(false);

      setNewChatContent(streamChats);
    }
  };
  const [newChatContent, setNewChatContent] = useState<StreamChat[] | null>(
    null,
  );
  const [startNew, setStartNew] = useState(false);

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

  useImperativeHandle(setLoadingNewAnimation, () => (loading: boolean) => {
    setStartNew(loading);
  });

  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, [conversation]);

  return (
    <div
      ref={container}
      className={`box-content w-full flex-grow overflow-x-clip overflow-y-scroll ${style.scroll_bar} ${style.container}`}
    >
      <LazyLoading loading={messages.length === 0}>
        <div
          // ref={container}
          className={`flex w-full flex-col items-center gap-10 pr-5 sm:p-10 md:p-20 lg:p-10`}
        >
          {messages.map((message, index) =>
            message.role === 'user' ? (
              <LLMAsk key={index} content={message.content} />
            ) : (
              <LLMAnswer key={index} content={message.content} />
            ),
          )}
          <LazyLoading loading={startNew}>
            {newChatContent && (
              <LLMAnswer
                streamChats={newChatContent}
                setScrollBar={setScrollBar}
                completeAddNewChat={completeAddNewChat}
              />
            )}
          </LazyLoading>
        </div>
      </LazyLoading>
    </div>
  );
}
