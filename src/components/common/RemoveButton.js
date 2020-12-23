import React from 'react';
import { MdClear } from 'react-icons/md';

export const RemoveButton = props => {
  const { className, onClick, disabled, accessibleName } = props;

  return (
    <button onClick={onClick}
      disabled={disabled}
      className={`bg-red-300 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed rounded p-1 ${className || ''}`}
    >
      <MdClear />
      <span className="sr-only">{accessibleName}</span>
    </button>
  );
};