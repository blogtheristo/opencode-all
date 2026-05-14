import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Defect {
  id: string;
  location: string;
  ifcGuid?: string;
  category: string;
  severity: 'critical' | 'major' | 'minor';
  description: string;
  photo?: string;
  aiDetected: boolean;
  aiConfidence?: number;
  responsible?: string;
  deadline?: string;
  status: 'open' | 'in_progress' | 'fixed' | 'approved';
}

interface InspectionArea {
  id: string;
  area: string;
  ifcGuid?: string;
  status: 'approved' | 'with_notes' | 'rejected' | 'not_inspected';
  notes?: string;
}

interface Inspection {
  id: string;
  projectCode: string;
  projectName: string;
  date: string;
  type: string;
  areas: InspectionArea[];
  defects: Defect[];
  panoramaPhotos: string[];
  videos: string[];
  rylCompliance: number;
  overallAssessment: string;
  synced: boolean;
}

interface InspectionState {
  inspections: Inspection[];
  currentInspection: Partial<Inspection> | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

const initialState: InspectionState = {
  inspections: [],
  currentInspection: null,
  syncStatus: 'idle',
};

const inspectionSlice = createSlice({
  name: 'inspection',
  initialState,
  reducers: {
    setCurrentInspection: (state, action: PayloadAction<Partial<Inspection>>) => {
      state.currentInspection = action.payload;
    },
    addDefect: (state, action: PayloadAction<Defect>) => {
      if (state.currentInspection) {
        if (!state.currentInspection.defects) {
          state.currentInspection.defects = [];
        }
        state.currentInspection.defects.push(action.payload);
      }
    },
    updateDefect: (state, action: PayloadAction<Defect>) => {
      if (state.currentInspection?.defects) {
        const index = state.currentInspection.defects.findIndex(
          d => d.id === action.payload.id
        );
        if (index !== -1) {
          state.currentInspection.defects[index] = action.payload;
        }
      }
    },
    addPanoramaPhoto: (state, action: PayloadAction<string>) => {
      if (state.currentInspection) {
        if (!state.currentInspection.panoramaPhotos) {
          state.currentInspection.panoramaPhotos = [];
        }
        state.currentInspection.panoramaPhotos.push(action.payload);
      }
    },
    saveInspection: (state, action: PayloadAction<Inspection>) => {
      state.inspections.push(action.payload);
      state.currentInspection = null;
    },
    setSyncStatus: (state, action: PayloadAction<InspectionState['syncStatus']>) => {
      state.syncStatus = action.payload;
    },
  },
});

export const {
  setCurrentInspection,
  addDefect,
  updateDefect,
  addPanoramaPhoto,
  saveInspection,
  setSyncStatus,
} = inspectionSlice.actions;

export default inspectionSlice.reducer;
