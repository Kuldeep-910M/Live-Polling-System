import React from 'react';
import socketService from '../services/socket';

const StudentManagement = ({ students }) => {
  const handleKickStudent = (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from the session?`)) {
      socketService.kickStudent(studentId);
    }
  };

  if (students.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Online</h3>
        <p className="text-gray-600">Students will appear here when they join the session</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        Online Students ({students.length})
      </div>
      
      <div className="space-y-3">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-medium">
                  {student.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{student.name}</h4>
                <p className="text-sm text-gray-600">
                  Joined: {new Date(student.joinedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 mr-3">Online</span>
              <button
                onClick={() => handleKickStudent(student.id, student.name)}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Remove student"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-blue-800">
            Students can be removed from the session by clicking the delete button.
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;