import DialogInput from '@/components/LLM/DialogInput';
import PortIn from '@/components/Port/portIn';
import { useNavigate } from 'react-router';
import { usePortStore } from '@/store/port';
import { UseCreateConversation } from '@/hooks/conversation';
import { useEffect, useState } from 'react';
import { getBotDetails } from '@/api/bot';
import { useConversationStore } from '@/store/conversation';
import { LazyLoading } from '@/components/LoadingAnimation/LazyLoading';

export default function Conversation() {
  const navigate = useNavigate();
  const activePort = usePortStore((state) => state.activePort);
  const addConversation = UseCreateConversation().addConversation;
  // const selectedBot = usePortStore((state) => state.selectedBot);
  const selectedBotId = useConversationStore((state) => state.selectedBotId);

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
  const [suggestQuestions, setSuggestQuestions] = useState<any[] | null>(null);

  const updateOnboarding = async () => {
    console.log('selectedBotId', selectedBotId);

    const res = await getBotDetails(selectedBotId!.bot_id);
    setSuggestQuestions(res.data.onboarding_info.suggested_questions);
    console.log(res);
  };

  useEffect(() => {
    updateOnboarding();
  }, [selectedBotId]);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <PortIn id="conversation" className="flex w-full justify-center px-10">
        <DialogInput sendMessage={addNewConversation} />
      </PortIn>
      <div className="bg-gray-5 rd-1 absolute top-[60%] flex flex-col items-start justify-center overflow-hidden p-5">
        <LazyLoading loading={suggestQuestions === null}>
          <span className="z-1 absolute left-2 top-1">try to ask:</span>
          {suggestQuestions?.map((suggested_question, index) => (
            <div
              key={suggested_question}
              className="animate-fade-in-right animate-duration-200 rd-1 hover:bg-gray-4 hover:text-gray-1 m-.5 cursor-pointer px-2 py-1 transition-all duration-300 ease-in-out"
              onClick={() => {
                addConversation(suggested_question);
              }}
            >
              {suggested_question}
            </div>
          ))}
        </LazyLoading>
      </div>
    </div>
  );
}
