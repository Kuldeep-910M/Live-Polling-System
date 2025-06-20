import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';
import socketService from '../services/socket';

const HomePage = () => {
  const dispatch = useDispatch();
  const [studentName, setStudentName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  const handleTeacherJoin = () => {
    setIsJoining(true);
    dispatch(setUser({ name: 'Teacher', role: 'teacher' }));
    socketService.joinAsTeacher();
    setIsJoining(false);
  };

  const handleStudentJoin = () => {
    if (!studentName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsJoining(true);
    setError('');
    
    dispatch(setUser({ name: studentName.trim(), role: 'student' }));
    socketService.joinAsStudent(studentName.trim());
    setIsJoining(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Live Polling System</h2>
          <p className="mt-2 text-sm text-gray-600">Real-time classroom polling made easy</p>
        </div>

        {/* Join Options */}
        <div className="space-y-6">
          {/* Teacher Section */}
          <div className="card">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Teacher</h3>
              <p className="text-sm text-gray-600 mb-4">Create and manage polls, view results</p>
              <button
                onClick={handleTeacherJoin}
                disabled={isJoining}
                className="btn-primary w-full"
              >
                {isJoining ? 'Joining...' : 'Enter as Teacher'}
              </button>
            </div>
          </div>

          {/* Student Section */}
          <div className="card">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Student</h3>
              <p className="text-sm text-gray-600 mb-4">Join polls and see live results</p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStudentJoin()}
                  className="input-field"
                  maxLength={30}
                  disabled={isJoining}
                />
                
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
                
                <button
                  onClick={handleStudentJoin}
                  disabled={isJoining || !studentName.trim()}
                  className="btn-primary w-full"
                >
                  {isJoining ? 'Joining...' : 'Enter as Student'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="text-center text-sm text-gray-500">
          <p className="mb-2">✨ Features</p>
          <div className="space-y-1">
            <p>📊 Real-time polling results</p>
            <p>💬 Live chat system</p>
            <p>⏱️ Customizable time limits</p>
            <p>👥 Student management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;