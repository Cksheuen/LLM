import IndependentLeftPart from '../IndependentLeftPart';
import { Outlet } from 'react-router-dom';

export default function IndependentDialogBox() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-0">
      <div className="left_part h-full">
        <IndependentLeftPart />
      </div>
      <div className="right_part flex h-full flex-grow flex-col items-center justify-center gap-0">
        {/* <IndependentConversationHeader />
                <div
                    ref={container}
                    className={`flex-grow overflow-x-clip overflow-y-scroll w-full ${style.scroll_bar}`}>
                    <LLMConversation />
                </div>
                <DialogInput /> */}
        <Outlet />
      </div>
    </div>
  );
}
