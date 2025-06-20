import React, { useState } from 'react';
import socketService from '../services/socket';

const CreatePoll = ({ canCreate }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    setIsCreating(true);
    
    const pollData = {
      question: question.trim(),
      options: validOptions.map(opt => opt.trim()),
      timeLimit: parseInt(timeLimit)
    };

    socketService.createPoll(pollData);

    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setTimeLimit(60);
    setIsCreating(false);
  };

  if (!canCreate) {
    return (
      <div className="card text-center py-8">
        <div className="text-yellow-400 text-6xl mb-4">⏳</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Poll in Progress</h3>
        <p className="text-gray-600">Please wait for the current poll to end before creating a new one.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poll Question *
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your poll question..."
            className="input-field h-20 resize-none"
            maxLength={200}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {question.length}/200 characters
          </p>
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer Options *
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600 w-6">
                  {String.fromCharCode(65 + index)}.
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="input-field flex-1"
                  maxLength={100}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 6 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Option
            </button>
          )}
        </div>

        {/* Time Limit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Limit
          </label>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(parseInt(e.target.value))}
            className="input-field w-full"
          >
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
            <option value={180}>3 minutes</option>
            <option value={300}>5 minutes</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isCreating || !question.trim() || options.filter(opt => opt.trim()).length < 2}
            className="btn-primary px-8"
          >
            {isCreating ? 'Creating...' : 'Create Poll'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;