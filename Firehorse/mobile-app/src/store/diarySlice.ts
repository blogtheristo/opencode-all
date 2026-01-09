import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DiaryEntry {
  id: string;
  projectCode: string;
  projectName: string;
  date: string;
  weather: string;
  temperature: string;
  workers: number;
  workDescription: string;
  photos: string[];
  signature?: string;
  synced: boolean;
}

interface AutoFillData {
  weather: string | null;
  temperature: string | null;
  workers: number | null;
  humidity: number | null;
}

interface DiaryState {
  entries: DiaryEntry[];
  currentEntry: Partial<DiaryEntry> | null;
  autoFillData: AutoFillData;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

const initialState: DiaryState = {
  entries: [],
  currentEntry: null,
  autoFillData: {
    weather: null,
    temperature: null,
    workers: null,
    humidity: null,
  },
  syncStatus: 'idle',
};

const diarySlice = createSlice({
  name: 'diary',
  initialState,
  reducers: {
    setAutoFillData: (state, action: PayloadAction<AutoFillData>) => {
      state.autoFillData = action.payload;
    },
    setCurrentEntry: (state, action: PayloadAction<Partial<DiaryEntry>>) => {
      state.currentEntry = action.payload;
    },
    saveEntry: (state, action: PayloadAction<DiaryEntry>) => {
      state.entries.push(action.payload);
      state.currentEntry = null;
    },
    updateEntry: (state, action: PayloadAction<DiaryEntry>) => {
      const index = state.entries.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    setSyncStatus: (state, action: PayloadAction<DiaryState['syncStatus']>) => {
      state.syncStatus = action.payload;
    },
    markAsSynced: (state, action: PayloadAction<string>) => {
      const entry = state.entries.find(e => e.id === action.payload);
      if (entry) {
        entry.synced = true;
      }
    },
  },
});

export const {
  setAutoFillData,
  setCurrentEntry,
  saveEntry,
  updateEntry,
  setSyncStatus,
  markAsSynced,
} = diarySlice.actions;

export default diarySlice.reducer;
