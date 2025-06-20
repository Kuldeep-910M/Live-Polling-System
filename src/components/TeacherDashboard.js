import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { setPollHistory } from '../store/slices/pollSlice';
import axios from 'axios';
import CreatePoll from './CreatePoll';
import PollResults from './PollResults';
import StudentManagement from './StudentManagement';
import PollHistory from './PollHistory';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { name, students, isConnected } = useSelector((state) => state.user);
  const { currentPoll, results, canCreatePoll, pollHistory } = useSelector((state) => state.poll);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    // Load poll history on mount
    const loadPollHistory = async () => {
      try {
        const response = await axios.get('/api/poll-history');
        dispatch(setPollHistory(response.data));
      } catch (error) {
        console.error('Failed to load poll history:', error);
      }
    };

    loadPollHistory();
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  const tabs = [
    { id: 'current', label: 'Current Poll', icon: '📊' },
    { id: 'create', label: 'Create Poll', icon: '➕' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'history', label: 'History', icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v6a2 2 0 002 2m0-8V7a2 2 0 012-2h8a2 2 0 012 2v2m-2 4h.01M7 15h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Teacher Dashboard</h1>
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
              <div className="text-sm text-gray-600">
                {students.length} student{students.length !== 1 ? 's' : ''} online
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {tab.id === 'students' && students.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-1">
                      {students.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="fade-in">
          {activeTab === 'current' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Poll Status</h2>
              {currentPoll ? (
                <PollResults poll={currentPoll} results={results} showDetailed={true} />
              ) : (
                <div className="card text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Poll</h3>
                  <p className="text-gray-600 mb-4">Create a new poll to get started</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="btn-primary"
                  >
                    Create Your First Poll
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Poll</h2>
              <CreatePoll canCreate={canCreatePoll} />
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Management</h2>
              <StudentManagement students={students} />
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Poll History</h2>
              <PollHistory history={pollHistory} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;