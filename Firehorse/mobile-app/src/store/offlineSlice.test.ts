import reducer, {
  setOnlineStatus,
  addToQueue,
  removeFromQueue,
  incrementRetries,
  setSyncInProgress,
  setLastSync,
  clearQueue,
} from './offlineSlice';

describe('offlineSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      isOnline: true,
      syncQueue: [],
      lastSync: null,
      syncInProgress: false,
    });
  });

  it('tracks online status', () => {
    const state = reducer(undefined, setOnlineStatus(false));
    expect(state.isOnline).toBe(false);
  });

  it('adds an item to the sync queue with a generated id, timestamp, and zeroed retries', () => {
    const state = reducer(undefined, addToQueue({ type: 'diary', data: { foo: 'bar' } }));
    expect(state.syncQueue).toHaveLength(1);
    const item = state.syncQueue[0];
    expect(item.type).toBe('diary');
    expect(item.data).toEqual({ foo: 'bar' });
    expect(item.retries).toBe(0);
    expect(typeof item.id).toBe('string');
    expect(typeof item.timestamp).toBe('number');
  });

  it('removes an item from the queue by id', () => {
    const queued = reducer(undefined, addToQueue({ type: 'inspection', data: {} }));
    const id = queued.syncQueue[0].id;
    const state = reducer(queued, removeFromQueue(id));
    expect(state.syncQueue).toHaveLength(0);
  });

  it('increments retries for a matching queue item only', () => {
    const queued = reducer(undefined, addToQueue({ type: 'carbon', data: {} }));
    const id = queued.syncQueue[0].id;
    const state = reducer(queued, incrementRetries(id));
    expect(state.syncQueue[0].retries).toBe(1);
  });

  it('tracks sync-in-progress and last-sync timestamp', () => {
    let state = reducer(undefined, setSyncInProgress(true));
    expect(state.syncInProgress).toBe(true);
    state = reducer(state, setLastSync('2026-07-04T00:00:00Z'));
    expect(state.lastSync).toBe('2026-07-04T00:00:00Z');
  });

  it('clears the entire queue', () => {
    const queued = reducer(undefined, addToQueue({ type: 'photo', data: {} }));
    const state = reducer(queued, clearQueue());
    expect(state.syncQueue).toEqual([]);
  });
});
