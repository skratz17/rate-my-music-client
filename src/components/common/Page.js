import React from 'react';

export const Page = props => {
  const { className } = props;

  return (
    <div className={`max-w-screen-lg mx-auto ${className || ''}`}>
      {props.children}
    </div>
  );
};