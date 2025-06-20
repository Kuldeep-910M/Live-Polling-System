import React from 'react';
import Timer from './Timer';

const PollResults = ({ poll, results, showDetailed = false }) => {
  if (!poll) {
    return (
      <div className="card text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <p className="text-gray-500">No poll data available</p>
      </div>
    );
  }

  const getOptionPercentage = (option) => {
    if (!results || results.totalResponses === 0) return 0;
    return ((results.results[option] || 0) / results.totalResponses * 100).toFixed(1);
  };

  const getOptionVotes = (option) => {
    return results?.results?.[option] || 0;
  };

  return (
    <div className="space-y-6">
      {/* Poll Header */}
      <div className="card">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {poll.question}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Created: {new Date(poll.createdAt).toLocaleString()}</span>
              <span>Time Limit: {poll.timeLimit}s</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                poll.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {poll.isActive ? 'Active' : 'Completed'}
              </span>
            </div>
          </div>
          
          {poll.isActive && <Timer />}
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="card-header">Results</div>
        
        {results && results.totalResponses > 0 ? (
          <div className="space-y-4">
            {poll.options.map((option, index) => {
              const votes = getOptionVotes(option);
              const percentage = getOptionPercentage(option);
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                    <span className="text-sm text-gray-600">
                      {votes} vote{votes !== 1 ? 's' : ''} ({percentage}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill bg-blue-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-3">🗳️</div>
            <p className="text-gray-500">No responses yet</p>
            {poll.isActive && <p className="text-sm text-gray-400">Waiting for students to answer...</p>}
          </div>
        )}
      </div>

      {/* Statistics */}
      {results && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">
              {results.totalResponses}
            </div>
            <div className="text-sm text-gray-600">Total Responses</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              {results.totalStudents}
            </div>
            <div className="text-sm text-gray-600">Students Online</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">
              {results.responseRate}%
            </div>
            <div className="text-sm text-gray-600">Response Rate</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-orange-600">
              {poll.options.length}
            </div>
            <div className="text-sm text-gray-600">Options</div>
          </div>
        </div>
      )}

      {/* Detailed Results for Teachers */}
      {showDetailed && poll.responses && Object.keys(poll.responses).length > 0 && (
        <div className="card">
          <div className="card-header">Individual Responses</div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.values(poll.responses).map((response, index) => (
              <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-800">{response.studentName}</span>
                <span className="text-gray-600">{response.answer}</span>
                <span className="text-xs text-gray-400">
                  {new Date(response.submittedAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PollResults;