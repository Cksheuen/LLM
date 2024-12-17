import IndependentDialogBox from '@/components/LLM/IndependentDialogBox';
import AuthorisationBtn from '@/components/AuthorisationBtn';
import SpeechToText from '@/components/SpeechToText';
import { useAuthorizationStore } from '@/store/authorisation';
import { useEffect } from 'react';
import PortCarrier from '@/components/Port/portCarrier';
import { useRecordStore } from '@/store/record';

export default function Home() {
  const authorisation = useAuthorizationStore((state) => state.authorisation);
  const recordStatus = useRecordStore((state) => state.status);

  useEffect(() => {
    console.log(import.meta.env.PERSONAL_AUTH_TOKEN);
  });

  useEffect(() => {
    console.log('recordStatus', recordStatus);
  }, [recordStatus]);
  return (
    <div className="bg-gray-6 text-gray-3 flex h-full w-full flex-col items-center justify-center gap-5">
      <PortCarrier className="h-full w-full">
        {!(import.meta.env.VITE_PERSONAL_AUTH_TOKEN || authorisation) && (
          <AuthorisationBtn />
        )}
        <IndependentDialogBox />
        <SpeechToText />
        {/* </PortIn> */}
      </PortCarrier>
    </div>
  );
}
