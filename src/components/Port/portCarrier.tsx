import { usePortStore } from '@/store/port';
import { Pos } from '@/utils/math';
import {
  useEffect,
  useRef,
  ReactNode,
  isValidElement,
  Children,
  cloneElement,
  createElement,
  useState,
} from 'react';

interface RecordProps {
  children: ReactNode;
  [key: string]: any;
}

function deserializeChildren(serializedChildren: string): ReactNode {
  const parsed = JSON.parse(serializedChildren, (_key, value) => {
    if (value && value.type && value.props) {
      return createElement(value.type, value.props);
    }

    return value;
  });
  return parsed;
}

export default function PortCarrier({ children, ...props }: RecordProps) {
  const pos = usePortStore((state) => state.pos);
  const elMaps = usePortStore((state) => state.elMaps);
  const status = usePortStore((state) => state.status);
  const updateStatus = usePortStore((state) => state.updateStatus);
  const closeIndex = usePortStore((state) => state.closeIndex);
  const initAll = usePortStore((state) => state.initAll);
  const port = useRef<HTMLElement>(null);
  const innerPort = useRef<HTMLElement>(null);
  const currentRecordPos = useRef<Pos | null>(null);

  /* useEffect(() => {
    for (const el of elMaps) {
      console.log(el);
    }
  }, [elMaps]); */

  const [showEls, setShowEls] = useState<any[]>([]);
  const [showElsInFact, setShowElsInFact] = useState<any[]>([]);

  /* useEffect(() => {
    if (closeIndex !== -1) {
      const newEls = showEls.filter((el) => el.id !== elMaps[closeIndex].id);
      console.log('close');

      setShowEls(newEls);
    }
  }, [closeIndex]); */

  const updateShowEls = async () => {
    const newEls = [...showEls];

    const changedElsId = elMaps[status].id;
    const changedId = newEls.findIndex((el) => el.id === changedElsId);
    const elMap = elMaps[status];
    const el = elMap.nodes[elMap.status];

    if (changedId !== -1) {
      newEls[changedId].node = deserializeChildren(el.node);
      newEls[changedId].pos = el.pos;
      newEls[changedId].funcs = el.funcs;
    } else {
      newEls.push({
        id: elMap.id,
        pos: {
          top: el.pos.top,
          left: el.pos.left,
        },
        node: deserializeChildren(el.node),
        funcs: el.funcs,
      });
    }
    setShowEls(newEls);
    setShowElsInFact(newEls);
  };

  useEffect(() => {
    if (status === -1) {
      if (closeIndex !== -1) {
        const newEls = showEls.filter((el) => el.id !== elMaps[closeIndex].id);
        setShowEls(newEls);
      }
      return;
    }

    updateShowEls();
  }, [status, elMaps]);

  const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
    initAll();
  };
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (showEls.length !== 0) {
      setTimeout(() => {
        setShowElsInFact([]);
      }, 800);
    }
  }, [showEls]);

  /* useEffect(() => {
    console.log('showElsInFact changed', showElsInFact);
  }, [showElsInFact]); */

  return (
    <div {...props}>
      <div className={`fixed left-0 top-0 z-10`}>
        {showElsInFact.map((el: any) => (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              top: el.pos.top + 'px',
              left: el.pos.left + 'px',
              transition: 'top 0.6s ease, left 0.6s ease',
              // opacity: '0',
            }}
            // {...el.node.props}
            {...el.funcs}
          >
            {el.node}
            {/* {el.id}
                {el.pos.top} */}
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}
