import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LifeCycleStage {
  stage: string;
  emissions: number;
  percentage: number;
}

interface CarbonReport {
  id: string;
  projectCode: string;
  projectName: string;
  date: string;
  totalEmissions: number;
  budget: number;
  budgetUsed: number;
  lifeCycleStages: LifeCycleStage[];
  compliance: {
    en15978: boolean;
    fitFor55: boolean;
    csrd: boolean;
    rt1611224: boolean;
  };
  alerts: string[];
  synced: boolean;
}

interface CarbonState {
  reports: CarbonReport[];
  currentReport: Partial<CarbonReport> | null;
  realTimeData: {
    totalEmissions: number;
    budgetUsed: number;
    lastUpdated: string | null;
  };
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

const initialState: CarbonState = {
  reports: [],
  currentReport: null,
  realTimeData: {
    totalEmissions: 0,
    budgetUsed: 0,
    lastUpdated: null,
  },
  syncStatus: 'idle',
};

const carbonSlice = createSlice({
  name: 'carbon',
  initialState,
  reducers: {
    setRealTimeData: (state, action: PayloadAction<CarbonState['realTimeData']>) => {
      state.realTimeData = action.payload;
    },
    setCurrentReport: (state, action: PayloadAction<Partial<CarbonReport>>) => {
      state.currentReport = action.payload;
    },
    saveReport: (state, action: PayloadAction<CarbonReport>) => {
      state.reports.push(action.payload);
      state.currentReport = null;
    },
    updateReport: (state, action: PayloadAction<CarbonReport>) => {
      const index = state.reports.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    },
    setSyncStatus: (state, action: PayloadAction<CarbonState['syncStatus']>) => {
      state.syncStatus = action.payload;
    },
  },
});

export const {
  setRealTimeData,
  setCurrentReport,
  saveReport,
  updateReport,
  setSyncStatus,
} = carbonSlice.actions;

export default carbonSlice.reducer;
