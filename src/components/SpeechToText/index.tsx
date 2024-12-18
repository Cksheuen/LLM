import PortIn from '@/components/Port/portIn';
import { usePortStore } from '@/store/port';
import { useRecordStore } from '@/store/record';
import { useState, useRef, useEffect } from 'react';

export default function SpeechToText() {
  const recordStatus = useRecordStore((state) => state.status);
  const updateRecordStatus = useRecordStore((state) => state.updateStatus);
  const activePort = usePortStore((state) => state.activePort);
  const closePort = usePortStore((state) => state.closePort);

  const [startRecording, setStartRecording] = useState(false);
  const recognition = useRef<any>(null);
  const [speech, setSpeech] = useState<string | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert(
        'Web Speech API is not supported by this browser. Please use Google Chrome.',
      );
      return;
    }
    recognition.current = new (window.webkitSpeechRecognition as any)();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;

    recognition.current.onresult = (event: any) => {
      // console.log('onresult', event);

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      console.log('finalTranscript', finalTranscript);

      setSpeech(finalTranscript);
    };

    recognition.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'network') {
        recognition.current.stop();
      }
    };

    return () => {
      stopRecord();
    };
  }, []);

  const startRecord = () => {
    console.log('startRecord');

    recognition.current.start();
  };

  const stopRecord = () => {
    console.log('stopRecord');

    recognition.current.stop();
  };

  const handleClick = () => {
    setStartRecording(!startRecording);
  };
  useEffect(() => {
    if (startRecording) {
      startRecord();
    } else {
      stopRecord();
    }
  }, [startRecording]);

  const handleClose = () => {
    setStartRecording(false);
    updateRecordStatus(false);
    activePort('record', 1);
    setTimeout(() => {
      activePort('record', 0);
    }, 10);
  };

  return (
    recordStatus && (
      <div className="bg-gray-5 bg-op-50 fixed left-0 top-0 flex h-full w-full flex-row items-center justify-center">
        <div className="bg-gray-6 rd-3 relative m-10 p-10">
          <div
            className="i-carbon-close-large text-5 text-gray-3 hover:text-gray-4 absolute right-2 top-2 cursor-pointer transition-all hover:rotate-180"
            onClick={() => handleClose()}
          />

          <div
            className={`flex ${
              startRecording ? 'flex-col-reverse' : 'flex-col'
            } items-center justify-center transition-all`}
          >
            <PortIn id="record">
              <div
                id="port"
                className={`i-carbon-microphone hover:text-gray-1 animate-duration-200 cursor-pointer transition-all ${
                  startRecording ? 'text-5 animate-fade-in-down' : 'text-10'
                } `}
                onClick={() => handleClick()}
              />
            </PortIn>
            <div
              className={`b-white b-solid b-0 b-b-1 animate-duration-100 max-w-100 min-w-20 transition-all ${
                startRecording
                  ? 'animate-fade-in-up mb-2 mt-5 pb-2'
                  : 'animate-fade-in-down mt-3 h-0 overflow-hidden'
              }`}
            >
              {speech}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
