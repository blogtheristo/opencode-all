import reducer, {
  setAutoFillData,
  setCurrentEntry,
  saveEntry,
  updateEntry,
  setSyncStatus,
  markAsSynced,
} from './diarySlice';

const entry = {
  id: 'e1',
  projectCode: 'P-1',
  projectName: 'Test Project',
  date: '2026-07-04',
  weather: 'sunny',
  temperature: '20C',
  workers: 5,
  workDescription: 'Poured foundation',
  photos: [],
  synced: false,
};

describe('diarySlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      entries: [],
      currentEntry: null,
      autoFillData: { weather: null, temperature: null, workers: null, humidity: null },
      syncStatus: 'idle',
    });
  });

  it('sets auto-fill data', () => {
    const data = { weather: 'rain', temperature: '10C', workers: 3, humidity: 80 };
    const state = reducer(undefined, setAutoFillData(data));
    expect(state.autoFillData).toEqual(data);
  });

  it('sets the current entry draft', () => {
    const state = reducer(undefined, setCurrentEntry({ projectCode: 'P-1' }));
    expect(state.currentEntry).toEqual({ projectCode: 'P-1' });
  });

  it('saves an entry and clears the draft', () => {
    const withDraft = reducer(undefined, setCurrentEntry({ projectCode: 'P-1' }));
    const state = reducer(withDraft, saveEntry(entry));
    expect(state.entries).toEqual([entry]);
    expect(state.currentEntry).toBeNull();
  });

  it('updates an existing entry by id', () => {
    const saved = reducer(undefined, saveEntry(entry));
    const state = reducer(saved, updateEntry({ ...entry, workers: 8 }));
    expect(state.entries[0].workers).toBe(8);
  });

  it('sets sync status', () => {
    const state = reducer(undefined, setSyncStatus('success'));
    expect(state.syncStatus).toBe('success');
  });

  it('marks a specific entry as synced without affecting others', () => {
    let state = reducer(undefined, saveEntry(entry));
    state = reducer(state, saveEntry({ ...entry, id: 'e2' }));
    state = reducer(state, markAsSynced('e1'));
    expect(state.entries.find((e) => e.id === 'e1')?.synced).toBe(true);
    expect(state.entries.find((e) => e.id === 'e2')?.synced).toBe(false);
  });
});
