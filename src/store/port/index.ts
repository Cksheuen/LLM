import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Pos } from '@/utils/math'

interface Node {
  index: number;
  node: string;
  pos: Pos;
  props: any;
  funcs: any;
}

interface ElMap {
  status: number;
  id: string;
  pos: Pos;
  nodes: Node[];
}

interface PortState {
  status: number
  pos: Pos | null;
  content: string;
  elMaps: ElMap[];
  closeIndex: number;
  setNewPos: (new_pos: Pos) => void;
  updateStatus: (status: number) => void;
  addProps: (id: string, pos: Pos, node: Node) => void;
  activePort: (id: string, index: number) => void;
  closePort: (id: string) => void;
  initAll: () => void;
}

export const usePortStore = create<PortState>()(
  devtools(
    persist(
      (set, get) => ({
        status: -1,
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
        addProps: (id: string, pos: Pos, node: Node) => {
          const newElmaps = get().elMaps;
          const index = newElmaps.findIndex((el) => el.id === id);
          if (index === -1) {
            newElmaps.push({ status: -1, id, pos, nodes: [node] });
          } else {
            const i = newElmaps[index].nodes.findIndex((n) => n.index === node.index);
            if (i !== -1) {
              newElmaps[index].nodes[i] = node;
            } else {
              newElmaps[index].nodes.push(node);
            }
          }
          if (!pos) {
            pos = newElmaps[0].pos;
          }
          // return { ...state, elMaps: newElmaps };
          set((state: PortState) => ({ ...state, elMaps: newElmaps, pos }));
          // get().activePort(id, node.index);
        },
        activePort: (id: string, index: number) => {

          const newElmaps = [...get().elMaps];
          const index_ = newElmaps.findIndex((el) => el.id === id);
          newElmaps[index_].status = index;
          set((state: PortState) => ({ ...state, elMaps: newElmaps, status: index_ }));
          // newElmaps[index_].pos = newElmaps[index_].nodes[index].pos;
        },
        closePort: (id: string) => {
          const newElmaps = get().elMaps;
          const index = newElmaps.findIndex((el) => el.id === id);
          newElmaps[index].status = -1;
          set((state: PortState) => ({ ...state, elMaps: newElmaps, status: -1, closeIndex: index }));
          setTimeout(() => {
            set((state: PortState) => ({ ...state, closeIndex: -1 }));

          }, 0);
        },
        initAll: () =>
          set((_state: PortState) => ({
            status: -1,
            pos: null,
            elMaps: [],
            content: 'Record',
            closeIndex: -1,
          })),

      }),
      {
        name: 'port',
      },
    ),
  ),
);
