import DialogInput from '@/components/LLM/DialogInput';
import PortIn from '@/components/Port/portIn';
import { useNavigate } from 'react-router';
import { usePortStore } from '@/store/port';
import { UseCreateConversation } from '@/hooks/conversation';
import { useEffect } from 'react';

export default function Conversation() {
  const navigate = useNavigate();
  const activePort = usePortStore((state) => state.activePort);
  const addConversation = UseCreateConversation().addConversation;

  /* useEffect(() => {
    activePort('conversation', 0);
  }, []); */

  const addNewConversation = async (textarea: HTMLTextAreaElement) => {
    // if (!textarea || !textarea.value) return;
    console.log(textarea.value);
    addConversation(textarea.value);
    // console.log(textarea.value);

    // navigate('/7449204302368751635');
    /* activePort('conversation', 0);
    setTimeout(() => {
      activePort('conversation', 1);
    }, 10); */
  };

  return (
    <PortIn id="conversation" className="w-full px-10">
      <DialogInput sendMessage={addNewConversation} />
    </PortIn>
  );
}
