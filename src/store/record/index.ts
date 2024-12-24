import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface RecordState {
  status: boolean
  recordContent: string | null
  updateStatus: (status: boolean) => void;
  updateRecordContent: (content: string | null) => void;
}

export const useRecordStore = create<RecordState>()(
  devtools(
    persist(
      (set) => ({
        status: false,
        recordContent: null,
        updateStatus: (status: boolean) => {
          set((state: RecordState) => ({ ...state, status }))
        },
        updateRecordContent: (recordContent: string | null) => {
          set((state: RecordState) => ({ ...state, recordContent }))
        }
      }),
      {
        name: 'record',
      },
    ),
  ),
);
