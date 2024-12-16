import { useEffect, useRef, useState } from 'react';
import { usePortStore } from '@/store/port';
import { useRecordStore } from '@/store/record';
import PortIn from '../Port/portIn';

export default function SpeechToTextIcon() {
  const status = usePortStore((state) => state.status);
  const setNewPos = usePortStore((state) => state.setNewPos);
  const updateStatus = usePortStore((state) => state.updateStatus);
  const activePort = usePortStore((state) => state.activePort);

  const updateRecordStatus = useRecordStore((state) => state.updateStatus);
  const el = useRef<HTMLDivElement>(null);

  const [speech, setSpeech] = useState<string | null>();

  const init = () => {
    if (el.current) {
      const el_rect = el.current.getBoundingClientRect();
      const top = el_rect.top;
      const left = el_rect.left;

      setNewPos({
        top,
        left,
      });
    }
  };

  useEffect(() => {
    init();
    updateRecordStatus(false);
    /*
    if (el.current) {
      const el_rect = el.current.getBoundingClientRect();
      const top = el_rect.top;
      const left = el_rect.left;

      setNewPos({
        top,
        left,
      });
    } */

    /*  */
  }, []);

  useEffect(() => {
    if (!status) {
      init();
    }
  }, [status]);

  return (
    <PortIn id="record" index={0}>
      <div
        className="i-carbon-microphone hover:text-gray-1 cursor-pointer"
        onClick={() => {
          updateRecordStatus(true);
          activePort('record', 0);
          setTimeout(() => {
            activePort('record', 1);
          }, 10);
        }}
        ref={el}
      />
    </PortIn>
  );
}
