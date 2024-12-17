import { useRef, useEffect, useState } from 'react';
import { getRemValue } from '@/utils/style';
import { createMessage } from '@/api/message';
import { createChat, createChatStream } from '@/api/chat';
import { getPublishedBotsList } from '@/api/bot';
import { useConversationStore } from '@/store/conversation';
import style from './index.module.css';
import { PublishedBotsList } from '@/type.d/space';
import { CreateChatParams, StreamChat } from '@/type.d/chat';
import SpeechToTextIcon from '../../SpeechToText/icon';

interface DialogInputProps {
  sendMessage: (textarea: HTMLTextAreaElement) => void;
}

export default function DialogInput({ sendMessage }: DialogInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const conversation = useConversationStore((state) => state.conversation);
  const selectedBotId = useConversationStore((state) => state.selectedBotId);
  const setBotId = useConversationStore((state) => state.setBotId);
  const [publishedBots, setPublishedBots] = useState<PublishedBotsList | null>(
    null,
  );

  const setBotsSelect = async () => {
    const res = await getPublishedBotsList();
    // console.log(res);
    setPublishedBots(res.data);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const handleInput = () => {
        textarea.style.height = 'auto';
        let line;
        if (textarea.scrollHeight % getRemValue() === 0) {
          line = textarea.scrollHeight / getRemValue();
        } else {
          line = Math.floor(textarea.scrollHeight / getRemValue()) + 1;
        }
        textarea.style.height = `${line}rem`;
        // console.log('textarea.scrollHeight', textarea.scrollHeight);
      };

      textarea.addEventListener('input', handleInput);

      return () => {
        textarea.removeEventListener('input', handleInput);
      };
    }
  }, []);

  useEffect(() => {
    setBotsSelect();
  }, []);

  return (
    <div className="text-gray-3 relative w-full max-w-4xl p-5">
      <textarea
        ref={textareaRef}
        className={`pr-15 rd-3 bg-gray-5 text-4 border-gray-6 focus-visible:ring-gray-7 text-gray-3 placeholder-gray-4 inline-block max-h-40 w-full resize-none overflow-y-auto border-solid p-3 pb-10 shadow-md focus-visible:outline-none focus-visible:ring-1 ${style.scroll_bar}`}
        placeholder="Type a message"
        rows={1}
      />
      <div
        className={`${style.pSelect} rd-2 bg-gray-4 text-gray-3 hover:bg-gray-4 hover:rd-t-none absolute relative bottom-5 left-2 inline-block cursor-pointer border-none px-3 py-1 shadow-md transition-all focus-visible:outline-none`}
      >
        {selectedBotId ? selectedBotId.bot_name : 'Select Bot'}
        <div
          className={`${style.pOptions} rd-t rd-r absolute bottom-5 left-0 my-1 flex flex-col items-center justify-center overflow-hidden transition-all ${style.animate_back_in_up} bg-gray-6`}
        >
          {publishedBots?.space_bots.map((bot, index) => (
            <div
              key={index}
              className={`hover:bg-gray-4 w-full px-3 py-1 text-center transition-all ${
                bot.bot_id === selectedBotId?.bot_id ? 'bg-gray-4' : ''
              }`}
              onClick={() => setBotId(bot)}
            >
              {bot.bot_name}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-4 rd-1 shadow-gray-5 text-gray-3 text-4 absolute right-3 top-3 flex items-center justify-center gap-3 px-3 py-1 shadow">
        <span className="i-carbon-link hover:text-gray-1 cursor-pointer transition-all"></span>
        <span className="i-carbon-drop-photo hover:text-gray-1 cursor-pointer transition-all"></span>
        <SpeechToTextIcon />
      </div>
      <div
        className={`bg-gray-6 hover:text-gray-1 hover:bg-gray-7 absolute bottom-11 right-5 flex cursor-pointer py-2 pl-5 pr-3 transition-all ${style.corner_btn}`}
        onClick={() => sendMessage(textareaRef.current!)}
      >
        <span className="i-carbon-send"></span>
      </div>
    </div>
  );
}
