import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import pollReducer from './slices/pollSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    poll: pollReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;