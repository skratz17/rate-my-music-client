import React from 'react';

export const Button = props => {
  const { className, type, disabled, onClick } = props;

  return (
    <button type={type || 'button'}
      onClick={onClick || (() => {})}
      disabled={disabled}
      className={`bg-lightblue hover:bg-lightblue-dark disabled:opacity-50 p-2 rounded-sm block ${className || ''}`}>
        {props.children}
    </button>
  );
};
