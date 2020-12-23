import React from 'react';
import { MdFavorite } from 'react-icons/md';

export const ListFavoriteControl = props => {
  const { favCount, isFavorited, onClick } = props;

  return (
    <div className="p-2 flex items-center relative bg-gray-200 hover:bg-gray-300">
      <button onClick={onClick} className="absolute w-full h-full top-0 left-0">
        <span className="sr-only">{isFavorited ? 'Unfavorite' : 'Favorite'} List</span>
      </button>
      <span className="text-xl mr-1">{favCount}</span>
      <MdFavorite className={`text-2xl ${isFavorited ? 'text-red-700' : 'text-black'}`} />
    </div>
  );
};