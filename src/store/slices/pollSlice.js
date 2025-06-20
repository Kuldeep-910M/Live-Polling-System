import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPoll: null,
  results: null,
  hasAnswered: false,
  timeRemaining: 0,
  canCreatePoll: true,
  pollHistory: [],
  error: null,
  isLoading: false,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPoll: (state, action) => {
      state.currentPoll = action.payload;
      state.error = null;
      if (action.payload) {
        state.canCreatePoll = false;
        state.timeRemaining = action.payload.timeLimit;
        // Reset answer status for new poll
        if (state.currentPoll?.id !== action.payload.id) {
          state.hasAnswered = false;
        }
      }
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setCanCreatePoll: (state, action) => {
      state.canCreatePoll = action.payload;
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    addToPollHistory: (state, action) => {
      state.pollHistory.unshift(action.payload);
    },
    clearPoll: (state) => {
      state.currentPoll = null;
      state.results = null;
      state.hasAnswered = false;
      state.timeRemaining = 0;
      state.canCreatePoll = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setPoll,
  setResults,
  setHasAnswered,
  setTimeRemaining,
  setCanCreatePoll,
  setPollHistory,
  addToPollHistory,
  clearPoll,
  setError,
  clearError,
  setLoading,
} = pollSlice.actions;

export default pollSlice.reducer;