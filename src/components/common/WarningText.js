import React from 'react';

export const WarningText = props => {
  if(!props.children) return null;
  return <p className="text-red-600">{props.children}</p>;
};