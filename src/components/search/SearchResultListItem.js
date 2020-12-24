import React from 'react';
import { Link } from 'react-router-dom';

export const SearchResultListItem = props => {
  const { to } = props;

  return (
    <li className="relative my-2 flex flex-col justify-center items-center text-center p-4 bg-gray-100 hover:bg-gray-200">
      <Link to={to} className="absolute w-full h-full top-0 left-0" />
      { props.children }
    </li>
  );
};