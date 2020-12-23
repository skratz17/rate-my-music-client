import React from 'react'
import { Link } from 'react-router-dom';
import { MdFavorite } from 'react-icons/md';

export const ListList = props => {
  const { lists } = props;

  if(!lists.length) {
    return <p className="italic">There are no lists to display.</p>
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-3">
      { lists.map(list => (
        <li key={list.id} className="relative py-4 px-2 bg-gray-200 hover:bg-gray-300">
          <Link to={`/lists/${list.id}`} className="absolute w-full h-full top-0 left-0">
            <span className="sr-only">{list.name} Page</span>
          </Link>
          <div className="flex flex-col items-center text-center">
            <span className="text-xl">{list.name}</span>
            <span>by {list.creator.user.username}</span>
            <div className="flex items-center">
              <span className="font-bold mr-1">{list.favCount} <span className="sr-only">favorites</span></span> 
              <MdFavorite className="text-red-700 text-xl" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};