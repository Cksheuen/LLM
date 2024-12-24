import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SystemState {
  lang: string;
  menuOpenKeys: Array<string | number>;
  setLang: (lang: string) => void;
  setMenuOpenKeys: (menuOpenKeys: Array<string | number>) => void;
}

export const useSystemStore = create<SystemState>()(
  devtools(
    persist(
      (set) => ({
        lang: 'zh-CN',
        menuOpenKeys: [],
        setLang: (lang: string) => {
          set({ lang });
        },
        setMenuOpenKeys: (menuOpenKeys: Array<string | number>) => {
          set({ menuOpenKeys });
        },
      }),
      {
        name: 'scholarship-v4/system',
      },
    ),
  ),
);
