import React from 'react';
import { useSelector } from 'react-redux';

const Timer = () => {
  const { timeRemaining } = useSelector((state) => state.poll);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeRemaining <= 10) return 'timer danger';
    if (timeRemaining <= 30) return 'timer warning';
    return 'timer normal';
  };

  return (
    <div className={getTimerClass()}>
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {formatTime(timeRemaining)}
    </div>
  );
};

export default Timer;