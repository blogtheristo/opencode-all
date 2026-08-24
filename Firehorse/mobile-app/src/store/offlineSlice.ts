import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SyncItem {
  id: string;
  type: 'diary' | 'inspection' | 'carbon' | 'photo' | 'video';
  data: any;
  timestamp: number;
  retries: number;
}

interface OfflineState {
  isOnline: boolean;
  syncQueue: SyncItem[];
  lastSync: string | null;
  syncInProgress: boolean;
}

const initialState: OfflineState = {
  isOnline: true,
  syncQueue: [],
  lastSync: null,
  syncInProgress: false,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    addToQueue: (state, action: PayloadAction<Omit<SyncItem, 'id' | 'timestamp' | 'retries'>>) => {
      const item: SyncItem = {
        ...action.payload,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        retries: 0,
      };
      state.syncQueue.push(item);
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.syncQueue = state.syncQueue.filter(item => item.id !== action.payload);
    },
    incrementRetries: (state, action: PayloadAction<string>) => {
      const item = state.syncQueue.find(i => i.id === action.payload);
      if (item) {
        item.retries += 1;
      }
    },
    setSyncInProgress: (state, action: PayloadAction<boolean>) => {
      state.syncInProgress = action.payload;
    },
    setLastSync: (state, action: PayloadAction<string>) => {
      state.lastSync = action.payload;
    },
    clearQueue: (state) => {
      state.syncQueue = [];
    },
  },
});

export const {
  setOnlineStatus,
  addToQueue,
  removeFromQueue,
  incrementRetries,
  setSyncInProgress,
  setLastSync,
  clearQueue,
} = offlineSlice.actions;

export default offlineSlice.reducer;
