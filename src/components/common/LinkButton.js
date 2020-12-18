import React from 'react';
import { Link } from 'react-router-dom';

export const LinkButton = props => {
  const { to, className } = props;

  return (
    <Link to={to}
      className={`bg-lightblue hover:bg-lightblue-dark text-black hover:text-black p-2 rounded-sm block ${className || ''}`}>
        {props.children}
    </Link>
  );
};