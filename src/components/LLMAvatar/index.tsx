export default function LLMAvatar() {
    const avatar: string = "c"
    return (
        <div>
            {avatar.includes("http") ? <img src={avatar} alt="avatar" />
                :
                <span className="w-5 h-5 bg-white rd-[50%] inline-block overflow-hidden text-black align-top
                flex items-center justify-center text-top">
                    {avatar}
                </span>}
        </div>
    )
}