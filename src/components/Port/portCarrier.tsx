import { usePortStore } from '@/store/port';
import { Pos } from '@/utils/math';
import { Timeout } from 'ahooks/lib/useRequest/src/types';
import React, {
  useEffect,
  useRef,
  ReactNode,
  createElement,
  useState,
} from 'react';

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
    // console.log('latest elmaps', elMaps, elsContainer.current);

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
      // console.log('setNewEls', elMaps, status);

      const newEls = [...showEls];

      const statusArr = Array.from(status);
      statusArr.forEach((singleStatus) => {
        const changedElsId = elMaps[singleStatus].id;
        const changedId = newEls.findIndex((el) => el.id === changedElsId);
        const elMap = elMaps[singleStatus];
        const el = elMap.nodes[elMap.nodes.length - 1];
        // console.log(changedElsId, changedId, elMap, el);

        if (changedId !== -1) {
          if (el.rect !== newEls[changedId]?.rect) {
            // console.log(newEls, changedId, 'changed', elMap, el);
            /* console.log(
              'showEls changed',
              changedElsId,
              ' to update',
              el.rect,
              newEls[changedId]?.rect,
            ); */

            newEls[changedId].node = el.element; // deserializeChildren(el.node);
            newEls[changedId].rect = el.rect;
            newEls[changedId].display = 'block';
            // newels[changeId].animation =
          } /*  else {
            // console.log('showEls not changed', changedElsId);

            newEls[changedId].display = 'none';
          } */
        } else {
          newEls.push({
            id: elMap.id,
            rect: el.rect,
            node: el.element, // deserializeChildren(el.node),
            display: 'block',
          });
        }
      });
      setShowEls(newEls);
      // console.log('newEls', newEls);

      finishUpdate();
    };
  };

  const timer = useRef<Timeout | null>(null);

  const clearChildrenDisplay = () => {
    const newEls = [...showEls];
    newEls.forEach((el) => {
      el.display = 'none';
    });
    console.log('clearChildrenDisplay', newEls);

    // setShowEls(newEls);
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
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
          clearChildrenDisplay();

          // setShowEls(newEls);
        }, 600);
      }
    });
    observer.observe(elsContainer.current!, {
      attributes: true,
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
    };
  }, [showEls]);

  useEffect(() => {
    if (Array.from(status).length === 0) {
      if (closeIndex !== -1) {
        const newEls = showEls.filter((el) => el.id !== elMaps[closeIndex].id);
        setShowEls(newEls);
      }
      return;
    }
    updateShowEls();
  }, [status, elMaps, update]);

  /* useEffect(() => {
    console.log('useeffect watch [update] changed', update);

    if (update) {
      updateShowEls();
      // console.log('updateShowEls complete');

      // finishUpdate();
    }
    // console.log('finish watch [update] changed', c);
  }, [update]); */

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
              opacity: el.display === 'block' ? '100' : '0',
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
