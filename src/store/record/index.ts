import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface RecordState {
  status: boolean
  updateStatus: (status: boolean) => void;
}

export const useRecordStore = create<RecordState>()(
  devtools(
    persist(
      (set, get) => ({
        status: false,
        updateStatus: (status: boolean) => {
          set((state: RecordState) => ({ ...state, status }))

        },
      }),
      {
        name: 'record',
      },
    ),
  ),
);
