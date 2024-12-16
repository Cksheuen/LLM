import { useEffect, useRef, useState } from 'react';
import IndependentConversationList from '../IndependentLeftPart';
import LLMConversation from '@/components/LLMConversation';
import IndependentConversationHeader from '../IndependentConversationHeader';
import DialogInput from '../DialogInput';
import style from './index.module.css';
import { getPublishedBotsList } from '@/api/bot';
// import { PublishedBotsList } from "@/type.d/space";
import { SimpleBot } from '@/type.d/bot';
import { Outlet } from 'react-router-dom';

export default function IndependentDialogBox() {
  // const container = useRef<HTMLDivElement>(null);
  const [spaceBots, setSpaceBots] = useState<SimpleBot[] | null>(null);

  async function getSpaceBotsData() {
    const res = await getPublishedBotsList();
    setSpaceBots(res.data.space_bots);
  }
  useEffect(() => {
    /* if (container.current) {
            container.current.scrollTop = container.current.scrollHeight;
        } */
    // getSpaceBotsData()
  }, []);
  return (
    <div className="flex h-full w-full items-center justify-center gap-0">
      <div className="left_part h-full">
        <IndependentConversationList />
      </div>
      <div className="right_part flex h-full flex-grow flex-col items-center justify-center gap-10">
        {/* <IndependentConversationHeader />
                <div
                    ref={container}
                    className={`flex-grow overflow-x-clip overflow-y-scroll w-full ${style.scroll_bar}`}>
                    <LLMConversation />
                </div>
                <DialogInput /> */}
        <Outlet />
      </div>
    </div>
  );
}
