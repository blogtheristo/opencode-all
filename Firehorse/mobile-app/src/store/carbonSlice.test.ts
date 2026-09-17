import reducer, {
  setRealTimeData,
  setCurrentReport,
  saveReport,
  updateReport,
  setSyncStatus,
} from './carbonSlice';

const report = {
  id: 'r1',
  projectCode: 'P-1',
  projectName: 'Test Project',
  date: '2026-07-04',
  totalEmissions: 100,
  budget: 500,
  budgetUsed: 20,
  lifeCycleStages: [],
  compliance: { en15978: true, fitFor55: true, csrd: false, rt1611224: false },
  alerts: [],
  synced: false,
};

describe('carbonSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      reports: [],
      currentReport: null,
      realTimeData: { totalEmissions: 0, budgetUsed: 0, lastUpdated: null },
      syncStatus: 'idle',
    });
  });

  it('sets real-time data', () => {
    const state = reducer(
      undefined,
      setRealTimeData({ totalEmissions: 42, budgetUsed: 10, lastUpdated: '2026-07-04' }),
    );
    expect(state.realTimeData).toEqual({
      totalEmissions: 42,
      budgetUsed: 10,
      lastUpdated: '2026-07-04',
    });
  });

  it('sets the current report', () => {
    const state = reducer(undefined, setCurrentReport({ projectCode: 'P-1' }));
    expect(state.currentReport).toEqual({ projectCode: 'P-1' });
  });

  it('saves a report and clears the current draft', () => {
    const withDraft = reducer(undefined, setCurrentReport({ projectCode: 'P-1' }));
    const state = reducer(withDraft, saveReport(report));
    expect(state.reports).toHaveLength(1);
    expect(state.reports[0]).toEqual(report);
    expect(state.currentReport).toBeNull();
  });

  it('updates an existing report by id', () => {
    const saved = reducer(undefined, saveReport(report));
    const state = reducer(saved, updateReport({ ...report, totalEmissions: 999 }));
    expect(state.reports[0].totalEmissions).toBe(999);
  });

  it('leaves reports untouched when updating an unknown id', () => {
    const saved = reducer(undefined, saveReport(report));
    const state = reducer(saved, updateReport({ ...report, id: 'missing', totalEmissions: 999 }));
    expect(state.reports).toEqual(saved.reports);
  });

  it('sets sync status', () => {
    const state = reducer(undefined, setSyncStatus('syncing'));
    expect(state.syncStatus).toBe('syncing');
  });
});
