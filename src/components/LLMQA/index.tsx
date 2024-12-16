import LLMAnswer from '@/components/LLMAnswer'
import LLMAsk from '@/components/LLMAsk';

export default function LLMQA() {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-5">
      <LLMAsk />
      <LLMAnswer />
    </div>
  );
}
