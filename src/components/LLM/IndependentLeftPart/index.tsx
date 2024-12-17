import { useEffect, useRef } from 'react';
import IndependentConversationList from '../IndependentConversationList';
import { useConversationListStore } from '@/store/conversationList';
import { createConversation } from '@/api/conversation';
import { useNavigate } from 'react-router-dom';
import { useConversationStore } from '@/store/conversation';

export default function IndependentLeftPart() {
  const starred = [];
  const {
    conversationList,
    addNewConversationEl,
    setAddAttribute,
    setDelAttribute,
    delConversationEl,
  } = useConversationListStore();
  const navigate = useNavigate();
  const setConversation = useConversationStore(
    (state) => state.setConversation,
  );

  const addConversation = async () => {
    const res = await createConversation();
    const new_index = conversationList.length;
    console.log('res', res);

    const newConversationEl = {
      title: `New conversation ${res.data.id}`,
      details: res.data,
      del: false,
      add: true,
    };

    addNewConversationEl(newConversationEl);
    navigate(`/${res.data.id}`);
    setConversation(newConversationEl);
    setTimeout(() => {
      setAddAttribute(false, new_index);
    }, 300);
  };

  const initialLoad = useRef(true);
  useEffect(() => {
    initialLoad.current = false;
  }, []);

  useEffect(() => {
    console.log('initialLoad', initialLoad.current);
  }, [initialLoad.current]);

  const delConversation = (index: number) => {
    setAddAttribute(false, index);
    setDelAttribute(true, index);

    setTimeout(() => {
      delConversationEl(index);
    }, 300);
  };
  return (
    <div className="bg-gray-7 shadow-gray-9 flex h-full w-full max-w-[20rem] flex-col justify-between p-5 shadow shadow-xl">
      <div className="flex flex-col gap-4 gap-6">
        <div className="title text-5 flex w-full items-center justify-between">
          <span>LLM</span>
          <span className="i-carbon-page-first text-3" />
        </div>
        <div
          className="new text-4 text-red-6 justify-left hover:text-red-5 flex cursor-pointer items-center gap-1 transition-all"
          onClick={addConversation}
        >
          <span className="i-carbon-add-comment inline-block" />
          <span>Start new chat</span>
        </div>
        <div className="starred flex flex-col gap-3">
          <div className="text-4 text-left">Starred</div>
          {starred.length === 0 ? (
            <div className="border-1 border-style-dashed border-gray-5 rd-3 text-gray-5 w-full border border-solid p-5 text-center">
              Star chats you often use
            </div>
          ) : (
            <div>noe</div>
          )}
        </div>
        <div>
          <div className="recents mb-5 flex flex-col gap-3">
            <div className="text-4 text-left">Recents</div>
            <IndependentConversationList
              conversations={conversationList!}
              delConversation={delConversation}
              initialLoad={initialLoad.current}
            />
          </div>
          <div className="justify-left text-3 hover:text-gray-3 text-gray-4 flex cursor-pointer items-center transition-all">
            <span>View all</span>
            <span className="i-carbon-arrow-right" />
          </div>
        </div>
      </div>
      <div>user</div>
    </div>
  );
}
