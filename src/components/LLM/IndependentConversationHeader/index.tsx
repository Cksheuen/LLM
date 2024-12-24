import { useConversationStore } from '@/store/conversation';

export default function IndependentConversationHeader() {
  const conversation = useConversationStore((state) => state.conversation);
  return (
    <div className="flex items-center justify-center pt-5">
      <div className="text-4 flex items-center justify-center gap-1">
        <span className="i-carbon-chat"></span>
        <span className="max-w-md overflow-hidden text-ellipsis">
          {conversation!.title}
        </span>
      </div>
    </div>
  );
}
