import React from 'react';

export const PlayerControl = props => {
  const { onClick, accessibleName } = props;

  return (
    <button className="text-3xl mx-2 hover:bg-gray-200" onClick={onClick}>
      { props.children }
      <span className="sr-only">{accessibleName}</span>
    </button>
  );
};