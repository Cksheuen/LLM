import { usePortStore } from '@/store/port';
import { Pos } from '@/utils/math';
import {
  useEffect,
  useRef,
  ReactNode,
  isValidElement,
  Children,
  cloneElement,
} from 'react';

interface RecordProps {
  children: ReactNode;
}

export default function Record({ children }: RecordProps) {
  const pos = usePortStore((state) => state.pos);
  const status = usePortStore((state) => state.status);
  const updateStatus = usePortStore((state) => state.updateStatus);
  const setNewPos = usePortStore((state) => state.setNewPos);
  const Record = useRef<HTMLDivElement>(null);
  const port = useRef<HTMLElement>(null);
  const innerPort = useRef<HTMLElement>(null);
  const currentRecordPos = useRef<Pos | null>(null);

  const setRecordPos = (new_pos: Pos) => {
    Record.current!.style.top = `${new_pos.top}px`;
    Record.current!.style.left = `${new_pos.left}px`;
  };

  const updateRecordPos = (origin: Pos, destination: Pos) => {
    innerPort.current!.className = port.current!.className;
    const t = 600;
    const durationX = Math.abs(destination.left - origin.left) / t;
    const durationY = Math.abs(destination.top - origin.top) / t;
    Record.current!.style.transition = `top ${durationX}s ease, left ${durationY}s ease`;
    setRecordPos(destination);
  };

  useEffect(() => {
    if (
      pos &&
      currentRecordPos.current?.left !== pos.left &&
      currentRecordPos.current?.top !== pos.top &&
      Record.current
    ) {
      if (currentRecordPos.current === null) {
        setRecordPos(pos);
      } else {
        updateRecordPos(currentRecordPos.current, pos);
      }
      currentRecordPos.current = pos;
    }
  }, [pos]);

  useEffect(() => {
    if (status && port.current) {
      const rect = port.current.getBoundingClientRect();
      setNewPos({ top: rect.top, left: rect.left });
    }
  }, [status, port.current]);

  const getPosInchildren = (node: ReactNode): ReactNode => {
    if (isValidElement(node)) {
      if (node.props.id === 'port') {
        return cloneElement(node, { ref: port });
      } else if (node.props.children) {
        return cloneElement(node, {
          children: Children.map(node.props.children, getPosInchildren),
        });
      }
    }
    return node;
  };

  return (
    <div
      className={`bg-op-70 bg-gray-5 absolute left-0 top-0 h-full w-full transition-all`}
      // style={{ display: status ? 'block' : 'none' }}
    >
      <div className={`absolute`} ref={Record}>
        <div
          className="i-carbon-microphone text-4 hover:text-gray-1 cursor-pointer"
          ref={innerPort}
          // onClick={() => updateStatus(true)}
        />
      </div>
      {getPosInchildren(children)}
    </div>
  );
}
