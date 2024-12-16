import {
  isValidElement,
  ReactNode,
  useEffect,
  useRef,
  cloneElement,
} from 'react';
import { usePortStore } from '@/store/port';
import { Pos } from '@/utils/math';
import { Timeout } from 'ahooks/lib/useRequest/src/types';

interface PortInProps {
  children: ReactNode;
  id: string;
  index: number;
}

export default function PortIn({ children, id, index, ...props }: PortInProps) {
  const childrenRef = useRef<HTMLElement>(null);
  const ChildrenPos = useRef<Pos | null>(null);
  const status = usePortStore((state) => state.status);
  const elMaps = usePortStore((state) => state.elMaps);
  const addProps = usePortStore((state) => state.addProps);
  const activePort = usePortStore((state) => state.activePort);
  function getPosOfChildren(node: ReactNode): ReactNode {
    if (isValidElement(node)) {
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
    if (childrenRef.current) {
      const rect = childrenRef.current.getBoundingClientRect();
      ChildrenPos.current = {
        top: rect.top,
        left: rect.left,
      };
      const funcs: any = {};
      const serializedChildren = JSON.stringify(children, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (value.$$typeof && value.props) {
            const newProps = { ...value.props };

            for (const key in newProps) {
              if (typeof newProps[key] === 'function') {
                // newProps[key] = newProps[key].toString();
                funcs[key] = newProps[key];
              }
            }

            return {
              type: value.type,
              props: newProps,
            };
          }
        }
        return value;
      });

      console.log('serializedChildren', serializedChildren);

      addProps(id, ChildrenPos.current, {
        index,
        node: serializedChildren,
        pos: ChildrenPos.current,
        props,
        funcs,
      });
    }
    if (status !== elMaps.findIndex((el) => el.id === id)) {
      childrenRef.current!.style.opacity = '100';
    }
  }, []);

  useEffect(() => {}, [childrenRef.current?.style.opacity]);

  const timers = useRef<Timeout[]>([]);

  useEffect(() => {
    if (status !== -1 && id === elMaps[status].id) {
      for (const timer of timers.current) {
        clearTimeout(timer);
      }
      const el = elMaps[status];

      const newTimers = [];

      if (el.nodes.length === 1) childrenRef.current!.style.opacity = '100';
      else {
        childrenRef.current!.style.opacity = '0';
        if (el.nodes[el.status].index === index) {
          const timer = setTimeout(() => {
            childrenRef.current!.style.opacity = '100';
          }, 600);
          newTimers.push(timer);
        }
      }

      timers.current = newTimers;
    }
  }, [status, elMaps]);
  return <div {...props}>{getPosOfChildren(children)}</div>;
}
