import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socket';
import Timer from './Timer';

const PollQuestion = ({ poll }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { timeRemaining } = useSelector((state) => state.poll);

  const handleSubmit = () => {
    if (!selectedOption) {
      alert('Please select an option');
      return;
    }

    setIsSubmitting(true);
    socketService.submitAnswer(selectedOption);
  };

  if (!poll || !poll.isActive) {
    return (
      <div className="card text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">⏰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Poll Ended</h3>
        <p className="text-gray-600">This poll is no longer active</p>
      </div>
    );
  }

  if (timeRemaining <= 0) {
    return (
      <div className="card text-center py-8">
        <div className="text-red-400 text-6xl mb-4">⏱️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Time's Up!</h3>
        <p className="text-gray-600">The poll has ended. Results will be shown shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Poll Header */}
      <div className="card">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {poll.question}
            </h2>
            <p className="text-gray-600">Select one option and submit your answer</p>
          </div>
          <Timer />
        </div>
      </div>

      {/* Options */}
      <div className="card">
        <div className="space-y-3">
          {poll.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedOption === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="poll-option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedOption === option
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedOption === option && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="font-medium text-gray-700 mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-gray-900 flex-1">{option}</span>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedOption || isSubmitting || timeRemaining <= 0}
            className="btn-primary px-8 py-3 text-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Time Remaining</span>
          <span className="text-sm text-gray-600">{timeRemaining}s</span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${
              timeRemaining <= 10 ? 'bg-red-500' : 
              timeRemaining <= 30 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${(timeRemaining / poll.timeLimit) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PollQuestion;