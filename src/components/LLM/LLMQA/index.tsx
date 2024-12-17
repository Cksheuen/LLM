import LLMAnswer from '@/components/LLM/LLMAnswer';
import LLMAsk from '@/components/LLM/LLMAsk';

export default function LLMQA() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <LLMAsk />
      <LLMAnswer />
    </div>
  );
}
