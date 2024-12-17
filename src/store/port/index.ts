import { create } from 'zustand';
import { isEqual, Pos } from '@/utils/math'
import { ReactNode } from 'react';
import { RectProps } from '@/utils/math';

interface Node {
  index: number;
  rect: RectProps;
  props: any;
  element: () => ReactNode
}

interface ElMap {
  id: string;
  nodes: Node[];
}

interface PortState {
  status: number
  update: boolean
  content: string;
  elMaps: ElMap[];
  closeIndex: number;
  setNewPos: (new_pos: Pos) => void;
  updateStatus: (status: number) => void;
  updateElmaps: (id: string, node: Node) => void;
  activePort: (id: string) => void;
  finishUpdate: () => void;
  closePort: (id: string, rect: RectProps) => void;
}

export const usePortStore = create<PortState>()(
  (set, get) => ({
    status: -1,
    update: false,
    pos: null,
    elMaps: [],
    content: 'Record',
    closeIndex: -1,
    updateStatus: (status: number) => {
      set((state: PortState) => ({ ...state, status }))
    },
    setNewPos: (new_pos: Pos) => {
      set((state: PortState) => ({ ...state, pos: new_pos }))
    },
    setContent: (content: string) =>
      set((state: PortState) => ({ ...state, content })),
    updateElmaps: (id: string, node: Node) => {
      const newElmaps = get().elMaps;
      const index = newElmaps.findIndex((el) => el.id === id);
      if (index === -1) {
        newElmaps.push({ id, nodes: [node] });
      } else {
        const nodeIndex = newElmaps[index].nodes.findIndex((el) => isEqual(el.rect, node.rect));
        if (nodeIndex !== -1) {
          newElmaps[index].nodes.slice(nodeIndex, 1);
        }
        newElmaps[index].nodes.push(node);
        // newElmaps[index].node = node
      }
      /* if (!pos) {
        pos = newElmaps[0].pos;
      } */
      // return { ...state, elMaps: newElmaps };
      set((state: PortState) => ({ ...state, elMaps: newElmaps, status: index !== -1 ? index : newElmaps.length }));
      // get().activePort(id, node.index);
    },
    activePort: (id: string) => {
      const index = get().elMaps.findIndex((el) => el.id === id);
      set((state: PortState) => ({ ...state, status: index, update: true }));
    },
    finishUpdate: () => set((state: PortState) => ({ ...state, update: false })),
    closePort: (id: string, rect: RectProps) => {
      const index = get().elMaps.findIndex((el) => el.id === id);
      const newElmaps = get().elMaps;
      newElmaps[index].nodes = newElmaps[index].nodes.filter((el) => !isEqual(el.rect, rect));
      set((state) => ({ ...state, elMaps: newElmaps, update: true }))
    },
  }),
);
