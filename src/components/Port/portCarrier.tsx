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
  const elsContainer = useRef<HTMLDivElement>();

  /* useEffect(() => {
    for (const el of elMaps) {
      console.log(el);
    }
  }, [elMaps]); */

  const [showEls, setShowEls] = useState<any[]>([]);

  const updateShowEls = async () => {
    if (elsContainer.current) {
      const observer = new MutationObserver(() => {
        if (
          elsContainer.current &&
          elsContainer.current.style.display === 'block'
        ) {
          observer.disconnect();
          setTimeout(() => {
            setNewEls();
          }, 0);
        }
      });

      observer.observe(elsContainer.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      elsContainer.current.style.display = 'block';
    }

    const setNewEls = () => {
      const newEls = [...showEls];

      const statusArr = Array.from(status);
      statusArr.forEach((singleStatus) => {
        const changedElsId = elMaps[singleStatus].id;
        const changedId = newEls.findIndex((el) => el.id === changedElsId);
        const elMap = elMaps[singleStatus];
        const el = elMap.nodes[elMap.nodes.length - 1];

        // console.log(newEls, changedId, 'changed', elMap, el);

        if (changedId !== -1) {
          newEls[changedId].node = el.element; // deserializeChildren(el.node);
          newEls[changedId].rect = el.rect;
          // newEls[changedId].display = 'block';
        } else {
          newEls.push({
            id: elMap.id,
            rect: el.rect,
            node: el.element, // deserializeChildren(el.node),
            // display: 'block',
          });
        }
      });
      setShowEls(newEls);
    };
  };

  const timer = useRef<Timeout | null>(null);
  // const observerStatus = useRef<MutationRecord[]>();
  const disconnectTimer = useRef<Timeout | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      // observerStatus.current = mutations;
      if (disconnectTimer.current) {
        clearTimeout(disconnectTimer.current);
      }
      if (timer.current) {
        clearTimeout(timer.current);
      }
      disconnectTimer.current = setTimeout(() => {
        observer.disconnect();

        timer.current = setTimeout(() => {
          if (elsContainer.current) elsContainer.current.style.display = 'none';
        }, 600);
      }, 10);
    });
    if (elsContainer.current?.style.display === 'block') {
      /* observer.observe(elsContainer.current, {
        attributes: true,
        childList: true,
        subtree: true,
      }); */
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        if (elsContainer.current) elsContainer.current.style.display = 'none';
      }, 600);
    }
    /* const childListExist = observerStatus.current?.find(
      (mutation) => mutation.type === 'childList',
    );
    console.log('childListExist', childListExist);

    if (observerStatus.current && !childListExist) {
      return () => {
        observer.disconnect();
        console.log('disconnect');
      };
    } */
  }, [elsContainer.current?.style.display]);

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

  /* useEffect(() => {
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
  }, [showElsInFact]); */

  /*  useEffect(() => {
    console.log('elsContainer changed', showEls);
  }, [elsContainer.current]); */

  useEffect(() => {
    if (Array.from(status).length === 0) {
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
      updateShowEls();
      finishUpdate();
    }
  }, [update]);

  return (
    <div {...props}>
      <div className={`fixed left-0 top-0 z-10`} ref={elsContainer}>
        {showEls.map((el: any) => (
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
