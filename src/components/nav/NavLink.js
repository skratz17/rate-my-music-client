import React from 'react';
import { Link } from 'react-router-dom';

export const NavLink = props => {
  const { to, className } = props;

  return (
    <Link to={to}
      className={`text-black hover:text-emerald-dark text-lg mx-3 md:my-0 my-1 ${className || ''}`}>
      {props.children}
    </Link>
  )
};