import ConversationListEl from '@/type.d/Conversation';
import style from './index.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConversationStore } from '@/store/conversation';

interface IndependentConversationListProps {
  conversations: ConversationListEl[];
  delConversation: (index: number) => void;
  initialLoad: boolean;
}

export default function IndependentConversationList({
  conversations,
  delConversation,
  initialLoad,
}: IndependentConversationListProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const setConversation = useConversationStore(
    (state) => state.setConversation,
  );

  const turnToConversation = (title: string) => {
    setConversation(
      conversations.find((conversation) => conversation.title === title)!,
    );
    navigate(`/${title}`);
  };
  return (
    <div
      className={`${style.ellipsis} text-gray-4 flex flex-col gap-1 transition-all`}
    >
      {conversations?.map((conversation, index) => (
        <div
          key={index}
          className={`${style.conversation} text-4 hover:bg-gray-8 hover-text-gray-3 rd-1 animate-duration-300 flex cursor-pointer items-center gap-2 p-2 transition-all ${
            conversation.del
              ? 'animate-slide-out-left'
              : conversation.add
                ? 'animate-slide-in-left'
                : ''
          } ${
            decodeURIComponent(location.pathname) === `/${conversation.title}`
              ? 'bg-gray-6 text-gray-3'
              : ''
          }`}
          onClick={() => turnToConversation(conversation.title)}
        >
          <span className="i-carbon-chat"></span>
          <span>{conversation.title}</span>
          <span
            onClick={() => delConversation(index)}
            className={`i-carbon-close hover:rotate--90 float-right ml-auto opacity-0 duration-200 ${style.icon}`}
          ></span>
        </div>
      ))}
    </div>
  );
}
