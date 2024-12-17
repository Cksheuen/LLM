import { usePortStore } from '@/store/port';
import { Pos } from '@/utils/math';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { useEffect, useRef, ReactNode, createElement, useState } from 'react';

interface RecordProps {
  children: ReactNode;
  [key: string]: any;
}

export default function PortCarrier({ children, ...props }: RecordProps) {
  const elMaps = usePortStore((state) => state.elMaps);
  const status = usePortStore((state) => state.status);
  const closeIndex = usePortStore((state) => state.closeIndex);
  const update = usePortStore((state) => state.update);
  const finishUpdate = usePortStore((state) => state.finishUpdate);
  const initAll = usePortStore((state) => state.initAll);
  const elsContainer = useRef<HTMLDivElement>();

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
    if (elsContainer.current) elsContainer.current.style.opacity = '100';
    const newEls = [...showEls];

    const changedElsId = elMaps[status].id;
    const changedId = newEls.findIndex((el) => el.id === changedElsId);
    const elMap = elMaps[status];
    const el = elMap.nodes[elMap.nodes.length - 1];

    if (changedId !== -1) {
      newEls[changedId].node = el.element; // deserializeChildren(el.node);
      newEls[changedId].rect = el.rect;
      newEls[changedId].display = 'block';
    } else {
      newEls.push({
        id: elMap.id,
        rect: el.rect,
        node: el.element, // deserializeChildren(el.node),
        display: 'block',
      });
    }
    setShowEls(newEls);
    setShowElsInFact(newEls);
    /* setTimeout(() => {
      setShowElsInFact([]);
    }, 3000); */
  };

  const timer = useRef<Timeout | null>(null);

  /* useEffect(() => {
    if (showElsInFact.length > 0) {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        setShowElsInFact([]);
      }, 1000);
    }
  }, [showElsInFact]); */

  useEffect(() => {
    console.log('showElsInFact changed', showElsInFact, ' to observe');
    const displayEls = showElsInFact.filter((el) => el.display === 'block');

    if (displayEls.length > 0) {
      console.log('showElsInFact changed', showElsInFact, ' to clear');

      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        console.log('clear', showElsInFact);
        const newEls = [...showElsInFact];
        for (const el of newEls) {
          el.display = 'none';
        }
        setShowElsInFact(newEls);
        if (elsContainer.current) elsContainer.current.style.opacity = '0';
      }, 600);
    }
  }, [showElsInFact]);

  useEffect(() => {
    console.log('elsContainer changed', showEls);
  }, [elsContainer.current]);

  useEffect(() => {
    console.log('watch status && elMaps', status, elMaps);

    if (status === -1) {
      if (closeIndex !== -1) {
        const newEls = showEls.filter((el) => el.id !== elMaps[closeIndex].id);
        setShowEls(newEls);
      }
      return;
    }

    updateShowEls();
  }, [status, elMaps]);

  useEffect(() => {
    if (update) {
      console.log('need update', update);
      updateShowEls();
      finishUpdate();
    }
  }, [update]);

  return (
    <div {...props}>
      <div className={`fixed left-0 top-0 z-10`} ref={elsContainer}>
        {showElsInFact.map((el: any) => (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              top: el.rect.top + 'px',
              left: el.rect.left + 'px',
              width: el.rect.width + 'px',
              height: el.rect.height + 'px',
              transition: 'top 0.6s ease, left 0.6s ease',
              // display: el.display,
              // opacity: '0',
            }}
            // {...el.node.props}
            // {...el.funcs}
          >
            {el.node()}
            {/* {el.id}
                {el.pos.top} */}
          </div>
        ))}
      </div>

      {children}
    </div>
  );
}
