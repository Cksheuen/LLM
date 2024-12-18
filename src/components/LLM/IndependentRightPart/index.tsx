import IndependentConversationHeader from '@/components/LLM/IndependentConversationHeader';
import LLMConversation from '@/components/LLM/LLMConversation';
import DialogInput from '@/components/LLM/DialogInput';
import { useRef, useEffect, useState } from 'react';
import style from './index.module.css';
import { useConversationStore } from '@/store/conversation';
import { StreamChat, CreateChatParams } from '@/type.d/chat';
import { MessageObj } from '@/type.d/message';
import { createChatStream } from '@/api/chat';
import PortIn from '@/components/Port/portIn';

export default function IndependentRightPart() {
  const container = useRef<HTMLDivElement>(null);
  const conversation = useConversationStore((state) => state.conversation);
  const streamChatRef =
    useRef<(streamChats: StreamChat[]) => void | null>(null);
  const userAddNewChatRef =
    useRef<(newMessage: MessageObj) => void | null>(null);
  const selectedBotId = useConversationStore((state) => state.selectedBotId);

  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = container.current.scrollHeight;
    }
  }, []);

  const sendMessage = async (textarea: HTMLTextAreaElement) => {
    if (!textarea || !textarea.value) return;
    console.log(textarea.value);
    // return

    userAddNewChatRef.current?.({
      id: '123',
      conversation_id: conversation?.details.id!,
      bot_id: selectedBotId?.bot_id!,
      chat_id: '123',
      role: 'user',
      content: textarea.value,
      content_type: 'text',
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
      type: 'question',
    } as MessageObj);
    // console.log(textareaRef.current?.value);
    /* const res = await createMessage({
            conversation_id: conversation?.details.id!,
            role: 'user',
            content: textareaRef.current?.value!,
            content_type: 'text'
        }) */
    const data = {
      conversation_id: conversation?.details.id!,
      bot_id: selectedBotId?.bot_id!,
      user_id: '123',
      auto_save_history: true,
      additional_messages: [
        {
          role: 'user',
          type: 'question',
          content: textarea.value,
          content_type: 'text',
        },
      ],
    } as CreateChatParams;
    textarea.value = '';
    const res = await createChatStream(data);

    console.log(res);
    // const res = ``

    const streamChats: StreamChat[] = [];
    let mi = 0;
    const matchKey = ['\ndata:{', '\nevent:'];
    const delHead = ['event', 'data'];

    /* 
        
        1831 437    'data:{"id":"7436991353617137699","conversation_id":"7436578045248552994","bot_id":"7436733409944535055","role":"assistant","type":"verbose","content":"{\\"msg_type\\":\\"generate_answer_finish\\",\\"data\\":\\"{\\\\\\"finish_reason\\\\\\":0,\\\\\\"FinData\\\\\\":\\\\\\"\\\\\\"}\\",\\"from_module\\":null,\\"from_unit\\":null}","content_type":"text","chat_id":"7436991276664487988","section_id":"7436578045248552994","created_at":1731559489,"updated_at":1731559489}'
        index.tsx:95 data {"id":"7436991353617137699","conversation_id":"7436578045248552994","bot_id":"7436733409944535055","role":"assistant","type":"verbose","content":{"msg_type":"generate_answer_finish","data":{\\"finish_reason\\":0,\\"FinData\\":\\"\\"},"from_module":null,"from_unit":null},"content_type":"text","chat_id":"7436991276664487988","section_id":"7436578045248552994","created_at":1731559489,"updated_at":1731559489} string
        */

    /* 
                const testData = `data:{"id":"7436987181706690597","conversation_id":"7436581446996934682","bot_id":"7434850698447257651","role":"assistant","type":"verbose","content":"{\\"msg_type\\":\\"generate_answer_finish\\",\\"data\\":\\"{\\\\\\"finish_reason\\\\\\":0,\\\\\\"FinData\\\\\\":\\\\\\"\\\\\\"}\\",\\"from_module\\":null,\\"from_unit\\":null}","content_type":"text","chat_id":"7436987093236318258","section_id":"7436581446996934682","created_at":1731558516,"updated_at":1731558516}`
        
        
                const index = testData.indexOf(matchKey[mi])
                const data = testData.slice(0, index).trim()
                console.log(testData.length, index, data);
        
                const sliceIndex = data.indexOf(':')
                const type = data.slice(0, sliceIndex).trim()
                const content = data.slice(sliceIndex + 1).trim()
                    .replace(/\\\"/g, '"')
                    .replace(/}\"/g, "}")
                    .replace(/\"{/g, "{")
                    .replace(/\n/g, "\\n")
                console.log(type, content, typeof content); */

    /* 
        {"id":"7438197851479425059","conversation_id":"7436581446996934682","bot_id":"7436733409944535055","role":"assistant","type":"verbose","content":{"msg_type":"generate_answer_finish","data":{\\"finish_reason\\":0,\\"FinData\\":\\"\\"},"from_module":null,"from_unit":null},"content_type":"text","chat_id":"7438197816809373748","section_id":"7436581446996934682","created_at":1731840400,"updated_at":1731840400} 
        */

    try {
      let resData = res as unknown as string;
      while (resData.length > 1) {
        console.log('keep');

        const index = resData.indexOf(matchKey[mi]);
        const data = resData.slice(0, index).trim();
        console.log(resData.length, index, data);
        if (data === 'event:done\ndata:"[DONE]"') break;

        const sliceIndex = data.indexOf(':');
        const type = data.slice(0, sliceIndex).trim();
        let content = data
          .slice(sliceIndex + 1)
          .trim()
          .replace(/\\\"/g, '"')
          .replace(/}\"/g, '}')
          .replace(/\"{/g, '{')
          .replace(/\n/g, '\\n');
        /* 
                {"id":"7438198479048015910","conversation_id":"7436578045248552994","bot_id":"7436733409944535055","role":"assistant","type":"answer","content":"\n\n","content_type":"text","chat_id":"7438198479047999526","section_id":"7436578045248552994"}
                */
        let before = null;
        while (
          (content.indexOf('\\n') !== -1 || content.indexOf('\\"') !== -1) &&
          before !== content
        ) {
          console.log(content, content.indexOf('\\n'));
          before = content;
          content = content
            .replace(/\\\"/g, '"')
            .replace(/}\"/g, '}')
            .replace(/\"{/g, '{')
            .replace(/\n/g, '\\n');
        }
        console.log(
          type,
          content,
          typeof content,
          before,
          content.indexOf('\\n'),
        );

        if (
          streamChats.length === 0 ||
          (streamChats.length !== 0 &&
            streamChats[streamChats.length - 1][type])
        ) {
          streamChats.push({
            event: null,
            data: null,
            [type]: type === 'data' ? JSON.parse(content) : content,
          });
        } else {
          // console.log(streamChats[streamChats.length - 1]);

          streamChats[streamChats.length - 1][type] =
            type === 'data' ? JSON.parse(content) : content;
        }
        resData = resData.slice(index);
        mi = (mi + 1) % 2;
      }
    } catch (error) {
      console.log(error);
    }

    console.log(streamChats);

    /* const lines = res.split('\n')
        console.log(lines);

        for (let i = 0; i < lines.length; i++) {
            console.log(lines[i]);
            const [type, content] = lines[i].split(':')
            console.log(type, content);

            if (type === 'event') {
                console.log(lines[i + 1]);
                const colonIndex = lines[i + 1].indexOf(':')
                const data = lines[i + 1].slice(0, colonIndex).trim()
                const dataContent = lines[i + 1].slice(colonIndex + 1).trim()
                console.log(data,
                    dataContent
                    , dataContent.replace(/\\\"/g, '"'));

                const newStreamChat: StreamChat = {
                    event: content,
                    data: JSON.parse(dataContent.replace(/\\\"/g, '"').replace(/}\"/g, "}").replace(/\"{/g, "{"))
                }
                streamChats.push(newStreamChat)
                i += 2
            }
        } */

    streamChatRef.current?.(streamChats);
    console.log(streamChats);
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
