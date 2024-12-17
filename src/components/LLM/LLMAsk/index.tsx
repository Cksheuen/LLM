import LLMAvatar from '../LLMAvatar';
import Content from '../../Content';
import { marked } from 'marked';

interface LLMAskProps {
  content: string;
}

export default function LLMAsk({ content }: LLMAskProps) {
  return (
    <div className="dialog-box justify-left bg-gray-7 shadow-gray-8 flex w-full max-w-3xl flex-row items-center gap-2 p-3 shadow-inner">
      <LLMAvatar />
      <Content markdown={content} />
    </div>
  );
}
