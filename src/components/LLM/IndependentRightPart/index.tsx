import IndependentConversationHeader from '@/components/LLM/IndependentConversationHeader';
import LLMConversation from '@/components/LLM/LLMConversation';
import DialogInput from '@/components/LLM/DialogInput';
import { useRef, useEffect } from 'react';
import { useConversationStore } from '@/store/conversation';
import { StreamChat } from '@/type.d/chat';
import { MessageObj } from '@/type.d/message';
import PortIn from '@/components/Port/portIn';
import { UseCreateConversation } from '@/hooks/conversation';

export default function IndependentRightPart() {
  const container = useRef<HTMLDivElement>(null);
  const conversation = useConversationStore((state) => state.conversation);
  const streamChatRef =
    useRef<(streamChats: StreamChat[]) => void | null>(null);
  const userAddNewChatRef =
    useRef<(newMessage: MessageObj) => void | null>(null);
  const selectedBotId = useConversationStore((state) => state.selectedBotId);
  const sendMsgByHook = UseCreateConversation().sendMessage;

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight;
    }
  }, []);

  const sendMessage = async (textarea: HTMLTextAreaElement) => {
    if (!textarea || !textarea.value) return;

    userAddNewChatRef.current?.({
      id: '123',
      conversation_id: conversation!.details.id!,
      bot_id: selectedBotId!.bot_id!,
      chat_id: '123',
      role: 'user',
      content: textarea.value,
      content_type: 'text',
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
      type: 'question',
    } as MessageObj);

    const streamChats = await sendMsgByHook(
      textarea.value,
      conversation!.details.id!,
      selectedBotId!.bot_id!,
    );

    streamChatRef.current?.(streamChats);
  };

  return (
    <>
      <IndependentConversationHeader />
      {/* <div
                ref={container}
                className={`flex-grow overflow-x-clip overflow-y-hidden w-full ${style.scroll_bar}`}> */}
      <LLMConversation
        streamChatRef={streamChatRef}
        userAddNewChatRef={userAddNewChatRef}
      />
      {/* </div> */}

      <PortIn id="conversation" className="w-full px-10">
        <DialogInput sendMessage={sendMessage} />
      </PortIn>
    </>
  );
}
