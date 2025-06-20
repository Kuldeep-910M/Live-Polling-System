import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import socketService from './services/socket';
import HomePage from './components/HomePage';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Chat from './components/Chat';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, role, isKicked, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Connect to socket service
    socketService.connect(dispatch);

    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  // Show error if kicked out
  if (isKicked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Session Ended</h2>
          <p className="text-gray-700 mb-4">You have been removed from the session.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <div className="min-h-screen bg-gray-100">
          {error && <ErrorMessage message={error} />}
          
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  role === 'teacher' ? <Navigate to="/teacher" replace /> : <Navigate to="/student" replace />
                ) : (
                  <HomePage />
                )
              } 
            />
            <Route 
              path="/teacher" 
              element={
                isAuthenticated && role === 'teacher' ? (
                  <TeacherDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route 
              path="/student" 
              element={
                isAuthenticated && role === 'student' ? (
                  <StudentDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Chat component - available when authenticated */}
          {isAuthenticated && <Chat />}
        </div>
      </Router>
    </div>
  );
}

export default App;