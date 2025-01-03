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
  const generateMessageObj = UseCreateConversation().generateMessageObj;
  const setNewStartAnimation = useRef<(start: boolean) => void | null>(null);

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight;
    }
  }, []);

  const sendMessage = async (textarea: HTMLTextAreaElement) => {
    if (!textarea || !textarea.value) return;

    const messageObj = generateMessageObj(
      textarea.value,
      conversation!.details.id!,
      selectedBotId!.bot_id!,
    );

    userAddNewChatRef.current?.(messageObj as MessageObj);

    setNewStartAnimation.current?.(true);
    const content = textarea.value;
    textarea.value = '';
    const streamChats = await sendMsgByHook(
      content,
      conversation!.details.id!,
      selectedBotId!.bot_id!,
    );

    setNewStartAnimation.current?.(false);

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
        setLoadingNewAnimation={setNewStartAnimation}
      />
      {/* </div> */}

      <PortIn id="conversation" className="w-full px-10">
        <DialogInput sendMessage={sendMessage} />
      </PortIn>
    </>
  );
}
