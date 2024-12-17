import { useEffect, useRef, useState } from 'react';
import { StreamChat } from '@/type.d/chat';
import { MessageObj } from '@/type.d/message';
import Content from '@/components/Content';

interface LLMAnswerProps {
  content?: string;
  streamChats?: StreamChat[];
  setScrollBar?: () => void;
  completeAddNewChat?: (newMessage: MessageObj) => void;
}

export default function LLMAnswer({
  content,
  streamChats,
  setScrollBar,
  completeAddNewChat,
}: LLMAnswerProps) {
  const corner_btns = [
    {
      name: 'Copy',
      icon: 'i-carbon-copy',
    },
    {
      name: 'Retry',
      icon: 'i-carbon-reset',
    },
    {
      name: 'thumb_up',
      icon: 'i-carbon-thumbs-up',
    },
    {
      name: 'thumb_down',
      icon: 'i-carbon-thumbs-down',
    },
  ];
  const container = useRef<HTMLDivElement>(null);
  const [showAnswer, setShowAnswer] = useState('');
  const [streamOver, setStreamOver] = useState(false);
  const index = useRef(0);
  const times = useRef(0);

  useEffect(() => {
    setScrollBar && setScrollBar();
  }, [container.current?.clientHeight]);

  function goOn() {
    if (times.current === 0) {
      if (index.current === streamChats!.length - 1) {
        setStreamOver(true);
        return;
      }
      if (streamChats![index.current].event === 'conversation.message.delta') {
        const delta = streamChats![index.current].data as MessageObj;
        setShowAnswer((prev) => prev + delta.content);
      }
      if (
        streamChats![index.current].event ===
          'conversation.message.completed' &&
        (streamChats![index.current].data as MessageObj).type === 'answer'
      ) {
        completeAddNewChat &&
          completeAddNewChat(streamChats![index.current].data as MessageObj);
      }
    } else if (times.current === 10) {
      times.current = -1;
      index.current++;
    }
    times.current++;
    requestAnimationFrame(goOn);
  }

  useEffect(() => {
    if (streamChats) {
      goOn();
    }
  }, []);
  return (
    <div ref={container} className="dialog-box w-full max-w-3xl">
      {content ? <Content markdown={content} /> : showAnswer}
      {streamOver && (
        <div className="text-2.5 bg-gray-5 rd-1 shadow-gray-4 animate-fade-in absolute bottom--3 right--3 flex items-center justify-center gap-2 p-2 shadow duration-100">
          {corner_btns.map((btn) => {
            return (
              <div
                key={btn.name}
                className="flex cursor-pointer items-center justify-center gap-1"
              >
                <span className={`${btn.icon} inline-block`} />
                {!btn.name.includes('thumb') && btn.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
