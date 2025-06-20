import React, { useState } from 'react';

const PollHistory = ({ history }) => {
  const [selectedPoll, setSelectedPoll] = useState(null);

  if (history.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Poll History</h3>
        <p className="text-gray-600">Your completed polls will appear here</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getWinningOption = (poll) => {
    if (!poll.results || !poll.results.results) return null;
    
    let maxVotes = 0;
    let winner = null;
    
    Object.entries(poll.results.results).forEach(([option, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        winner = option;
      }
    });
    
    return winner;
  };

  return (
    <div className="space-y-6">
      {/* History List */}
      <div className="card">
        <div className="card-header">
          Poll History ({history.length} polls)
        </div>
        
        <div className="space-y-4">
          {history.map((poll) => {
            const winner = getWinningOption(poll);
            const responseRate = poll.results?.responseRate || 0;
            const totalResponses = poll.results?.totalResponses || 0;
            
            return (
              <div
                key={poll.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedPoll(selectedPoll?.id === poll.id ? null : poll)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {poll.question}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📅 {formatDate(poll.createdAt)}</span>
                      <span>⏱️ {poll.timeLimit}s</span>
                      <span>📊 {totalResponses} responses</span>
                      <span>📈 {responseRate}% rate</span>
                    </div>
                    {winner && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🏆 Winner: {winner}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        selectedPoll?.id === poll.id ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {selectedPoll?.id === poll.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Options Results */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Results Breakdown</h5>
                      <div className="space-y-2">
                        {poll.options.map((option, index) => {
                          const votes = poll.results?.results?.[option] || 0;
                          const percentage = totalResponses > 0 
                            ? ((votes / totalResponses) * 100).toFixed(1) 
                            : 0;
                          
                          return (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center flex-1">
                                <span className="text-sm font-medium text-gray-600 w-6">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                <span className="text-sm text-gray-800 flex-1">{option}</span>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-16 text-right">
                                  {votes} ({percentage}%)
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Individual Responses */}
                    {poll.responses && Object.keys(poll.responses).length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Individual Responses</h5>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {Object.values(poll.responses).map((response, index) => (
                            <div key={index} className="flex justify-between items-center text-sm py-1 px-2 bg-gray-50 rounded">
                              <span className="font-medium text-gray-700">{response.studentName}</span>
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;