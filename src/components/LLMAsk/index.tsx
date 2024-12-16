import LLMAvatar from "../LLMAvatar";
import Content from "../Content";
import { marked } from "marked";

interface LLMAskProps {
    content: string
}

export default function LLMAsk({
    content
}: LLMAskProps) {
    return (
        <div className="w-full max-w-3xl dialog-box flex items-center justify-left flex-row gap-2
         bg-gray-7 shadow-inner shadow-gray-8">
            <LLMAvatar />
            <Content markdown={content} />
        </div>
    )
}