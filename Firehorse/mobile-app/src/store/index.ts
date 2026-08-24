import { configureStore } from '@reduxjs/toolkit';
import diaryReducer from './diarySlice';
import inspectionReducer from './inspectionSlice';
import carbonReducer from './carbonSlice';
import offlineReducer from './offlineSlice';

export const store = configureStore({
  reducer: {
    diary: diaryReducer,
    inspection: inspectionReducer,
    carbon: carbonReducer,
    offline: offlineReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['offline/addToQueue'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['offline.queue'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
