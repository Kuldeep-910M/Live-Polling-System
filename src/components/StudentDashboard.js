import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import PollQuestion from './PollQuestion';
import PollResults from './PollResults';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { name, isConnected } = useSelector((state) => state.user);
  const { currentPoll, results, hasAnswered } = useSelector((state) => state.poll);

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPoll ? (
          <div className="fade-in">
            {!hasAnswered && currentPoll.isActive ? (
              <PollQuestion poll={currentPoll} />
            ) : (
              <PollResults poll={currentPoll} results={results} />
            )}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⏳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Waiting for Poll</h3>
            <p className="text-gray-600">Your teacher will start a poll soon...</p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;