import { createConversation } from '@/api/conversation';
import { useConversationStore } from '@/store/conversation';
import { useConversationListStore } from '@/store/conversationList';
import { StreamChat, CreateChatParams } from '@/type.d/chat';
import { createChatStream } from '@/api/chat';
import { useNavigate } from 'react-router-dom';
import ConversationListEl from '@/type.d/Conversation';

export function UseCreateConversation() {
    const setConversation = useConversationStore((state) => state.setConversation)
    const navigate = useNavigate();
    const {
        conversationList,
        addNewConversationEl,
        setAddAttribute,
    } = useConversationListStore();

    const addConversation = async (firstQuestion: string) => {

        const res = await createConversation();
        const new_index = conversationList.length;
        console.log('res', res);

        const newConversationEl = {
            title: firstQuestion,//`New conversation ${res.data.id}`,
            details: res.data,
            del: false,
            add: true,
            id: res.data.id
        } as ConversationListEl;

        addNewConversationEl(newConversationEl);
        navigate(`/${res.data.id}`);
        setConversation(newConversationEl);
        setTimeout(() => {
            setAddAttribute(false, new_index);
        }, 300);
    }

    const sendMessage = async (content: string, conversation_id: string, bot_id: string) => {
        const data = {
            conversation_id,
            bot_id,
            user_id: '123',
            auto_save_history: true,
            additional_messages: [
                {
                    role: 'user',
                    type: 'question',
                    content: content,
                    content_type: 'text',
                },
            ],
        } as CreateChatParams;
        // textarea.value = '';
        const res = await createChatStream(data);

        console.log(res);
        // const res = ``

        const streamChats: StreamChat[] = [];
        let mi = 0;
        const matchKey = ['\ndata:{', '\nevent:'];
        // const delHead = ['event', 'data'];

        try {
            let resData = res as unknown as string;
            while (resData.length > 1) {
                console.log('keep');

                const index = resData.indexOf(matchKey[mi]);
                const data = resData.slice(0, index).trim();
                // console.log(resData.length, index, data);
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
                /* console.log(
                    type,
                    content,
                    typeof content,
                    before,
                    content.indexOf('\\n'),
                ); */

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
        return streamChats;
    }

    const generateMessageObj = (content: string, conversation_id: string, bot_id: string) => {
        return {
            id: '123',
            conversation_id,
            bot_id,
            chat_id: '123',
            role: 'user',
            content,
            content_type: 'text',
            created_at: new Date().getTime(),
            updated_at: new Date().getTime(),
            type: 'question',
        }
    }

    return {
        addConversation,
        sendMessage,
        generateMessageObj
    }
}