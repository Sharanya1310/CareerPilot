import React from 'react';

export const Progress = ({ value, className = "", indicatorColor = "bg-brand" }) => (
  <div className={`w-full bg-zinc-800 rounded-full h-2 overflow-hidden ${className}`}>
    <div
      className={`h-full rounded-full transition-all duration-500 ${indicatorColor}`}
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);
