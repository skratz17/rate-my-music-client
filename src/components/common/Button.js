import React from 'react';

export const Button = props => {
  const { className, type, onClick } = props;

  return (
    <button type={type || 'button'}
      onClick={onClick || (() => {})}
      className={`bg-lightblue hover:bg-lightblue-dark p-2 rounded-sm block ${className || ''}`}>
        {props.children}
    </button>
  );
};
