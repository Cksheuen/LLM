import {
  isValidElement,
  ReactNode,
  useEffect,
  useRef,
  cloneElement,
  useState,
} from 'react';
import { usePortStore } from '@/store/port';
import { isEqual, Pos } from '@/utils/math';
import { Timeout } from 'ahooks/lib/useRequest/src/types';

interface PortInProps {
  children: ReactNode;
  id: string;
  className?: string;
  [key: string]: any;
}

export default function PortIn({
  children,
  id,
  className,
  ...props
}: PortInProps) {
  const childrenRef = useRef<HTMLElement>(null);
  const ChildrenPos = useRef<Pos | null>(null);
  const status = usePortStore((state) => state.status);
  const elMaps = usePortStore((state) => state.elMaps);
  const update = usePortStore((state) => state.update);
  const updateElmaps = usePortStore((state) => state.updateElmaps);
  const activePort = usePortStore((state) => state.activePort);
  const closePort = usePortStore((state) => state.closePort);
  const propsData = useRef<any>(null);
  function getPosOfChildren(node: ReactNode): ReactNode {
    if (isValidElement(node)) {
      if (typeof node.type === 'function') {
        children = (
          <div className={className} {...props} id="PortInContainer">
            {children}
          </div>
        );
        node = children;
      }

      return cloneElement(node, {
        ref: childrenRef,
        style: {
          opacity: '0',
        },
      });
    }
    return null;
  }
  useEffect(() => {
    if (!propsData.current && childrenRef.current) {
      const rect = childrenRef.current.getBoundingClientRect();
      ChildrenPos.current = {
        top: rect.top,
        left: rect.left,
      };

      const element = () => {
        return children;
      };

      propsData.current = {
        id,
        node: {
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
          props,
          element,
        },
      };

      updateElmaps(propsData.current.id, propsData.current.node);
    } else {
      updateElmaps(propsData.current.id, propsData.current.node);
    }
    // const findIndex = elMaps.findIndex((el) => el.id === id);
    /*     console.log('id', id, index);

    console.log('findIndex', findIndex, status, elMaps); */

    /* if (findIndex !== -1 && status !== findIndex && childrenRef.current) {
      childrenRef.current.style.opacity = '100';
    } */

    activePort(id);
  }, [childrenRef.current]);

  useEffect(() => {
    console.log('useEffect ', id, ' updated', propsData.current.node.rect);
    return () => {
      closePort(id, propsData.current.node.rect);
    };
  }, []);

  useEffect(() => {}, [childrenRef.current?.style.opacity]);

  const timers = useRef<Timeout[]>([]);

  useEffect(() => {
    const statusArr = Array.from(status);
    const exist = statusArr.findIndex((index) => elMaps[index].id === id);
    if (statusArr.length !== 0 && exist !== -1 && childrenRef.current) {
      for (const timer of timers.current) {
        clearTimeout(timer);
      }
      const el = elMaps[statusArr[exist]];

      const newTimers = [];

      const elNodeRect = el.nodes[el.nodes.length - 1].rect;

      /* console.log(
        id,
        'change op',
        elNodeRect,
        propsData.current.node.rect,
        isEqual(elNodeRect, propsData.current.node.rect),
      ); */
      /* if (el.nodes.length === 1) childrenRef.current.style.opacity = '100';
      else { */
      childrenRef.current.style.opacity = '0';
      if (isEqual(elNodeRect, propsData.current.node.rect)) {
        const timer = setTimeout(() => {
          childrenRef.current!.style.opacity = '100';
        }, 500);
        newTimers.push(timer);
      }
      // }

      timers.current = newTimers;
    }
  }, [status, elMaps, update]);
  return getPosOfChildren(children);
}
