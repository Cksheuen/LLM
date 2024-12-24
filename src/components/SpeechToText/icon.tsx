import { useEffect, useRef } from 'react';
import { usePortStore } from '@/store/port';
import { useRecordStore } from '@/store/record';
import PortIn from '../Port/portIn';

export default function SpeechToTextIcon() {
  const status = usePortStore((state) => state.status);
  const setNewPos = usePortStore((state) => state.setNewPos);
  const activePort = usePortStore((state) => state.activePort);

  const updateRecordStatus = useRecordStore((state) => state.updateStatus);
  const el = useRef<HTMLDivElement>(null);

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
    <PortIn id="record">
      <div
        className="i-carbon-microphone hover:text-gray-1 cursor-pointer"
        onClick={() => {
          updateRecordStatus(true);
          activePort('record');
          setTimeout(() => {
            activePort('record');
          }, 10);
        }}
        ref={el}
      />
    </PortIn>
  );
}
