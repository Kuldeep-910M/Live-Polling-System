import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isOpen: false,
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
      // Increment unread count if chat is closed
      if (!state.isOpen) {
        state.unreadCount += 1;
      }
      // Keep only last 100 messages
      if (state.messages.length > 100) {
        state.messages = state.messages.slice(-100);
      }
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
      if (state.isOpen) {
        state.unreadCount = 0;
      }
    },
    openChat: (state) => {
      state.isOpen = true;
      state.unreadCount = 0;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    clearUnread: (state) => {
      state.unreadCount = 0;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setMessages,
  addMessage,
  toggleChat,
  openChat,
  closeChat,
  clearUnread,
  setLoading,
  setError,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;