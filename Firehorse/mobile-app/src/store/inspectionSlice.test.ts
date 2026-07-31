import reducer, {
  setCurrentInspection,
  addDefect,
  updateDefect,
  addPanoramaPhoto,
  saveInspection,
  setSyncStatus,
} from './inspectionSlice';

const defect = {
  id: 'd1',
  location: 'Floor 3',
  category: 'structural',
  severity: 'major' as const,
  description: 'Crack in beam',
  aiDetected: false,
  status: 'open' as const,
};

const inspection = {
  id: 'i1',
  projectCode: 'P-1',
  projectName: 'Test Project',
  date: '2026-07-04',
  type: 'quality',
  areas: [],
  defects: [],
  panoramaPhotos: [],
  videos: [],
  rylCompliance: 0.9,
  overallAssessment: 'ok',
  synced: false,
};

describe('inspectionSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ inspections: [], currentInspection: null, syncStatus: 'idle' });
  });

  it('sets the current inspection draft', () => {
    const state = reducer(undefined, setCurrentInspection({ projectCode: 'P-1' }));
    expect(state.currentInspection).toEqual({ projectCode: 'P-1' });
  });

  it('is a no-op when adding a defect with no current inspection', () => {
    const state = reducer(undefined, addDefect(defect));
    expect(state.currentInspection).toBeNull();
  });

  it('appends a defect to the current inspection draft', () => {
    const withDraft = reducer(undefined, setCurrentInspection({ projectCode: 'P-1' }));
    const state = reducer(withDraft, addDefect(defect));
    expect(state.currentInspection?.defects).toEqual([defect]);
  });

  it('updates a defect within the current inspection draft by id', () => {
    let state = reducer(undefined, setCurrentInspection({ projectCode: 'P-1' }));
    state = reducer(state, addDefect(defect));
    state = reducer(state, updateDefect({ ...defect, status: 'fixed' }));
    expect(state.currentInspection?.defects?.[0].status).toBe('fixed');
  });

  it('appends a panorama photo to the current inspection draft', () => {
    const withDraft = reducer(undefined, setCurrentInspection({ projectCode: 'P-1' }));
    const state = reducer(withDraft, addPanoramaPhoto('photo-1.jpg'));
    expect(state.currentInspection?.panoramaPhotos).toEqual(['photo-1.jpg']);
  });

  it('saves an inspection and clears the draft', () => {
    const state = reducer(undefined, saveInspection(inspection));
    expect(state.inspections).toEqual([inspection]);
    expect(state.currentInspection).toBeNull();
  });

  it('sets sync status', () => {
    const state = reducer(undefined, setSyncStatus('error'));
    expect(state.syncStatus).toBe('error');
  });
});
