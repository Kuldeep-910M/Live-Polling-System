import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: localStorage.getItem('userName') || '',
  role: localStorage.getItem('userRole') || '', // 'teacher' or 'student'
  isConnected: false,
  students: [],
  isAuthenticated: false,
  isKicked: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { name, role } = action.payload;
      state.name = name;
      state.role = role;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    addStudent: (state, action) => {
      const existingStudent = state.students.find(s => s.id === action.payload.id);
      if (!existingStudent) {
        state.students.push(action.payload);
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(s => s.id !== action.payload.id);
    },
    setKicked: (state, action) => {
      state.isKicked = action.payload;
      if (action.payload) {
        state.isAuthenticated = false;
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.name = '';
      state.role = '';
      state.isAuthenticated = false;
      state.isKicked = false;
      state.error = null;
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
    },
  },
});

export const {
  setUser,
  setConnected,
  setStudents,
  addStudent,
  removeStudent,
  setKicked,
  setError,
  clearError,
  logout,
} = userSlice.actions;

export default userSlice.reducer;