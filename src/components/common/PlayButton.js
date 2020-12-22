import React from 'react';
import { MdPlayCircleFilled } from 'react-icons/md';

export const PlayButton = props => {
  const { className, onClick, accessibleName } = props;

  return (
    <button onClick={onClick}
      className={`bg-transparent hover:text-deepred ${className || ''}`}>
        <MdPlayCircleFilled />
        <span className="sr-only">{accessibleName || "Play Songs"}</span>
    </button>
  );
};