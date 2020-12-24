import React from 'react';
import { MdFavorite } from 'react-icons/md';

import { SearchResultListItem } from '../search/SearchResultListItem';

export const ListSearchResultsList = props => {
  const { lists } = props;

  if(!lists.length) {
    return <p className="italic my-2 text-center">There are no lists to display.</p>
  }

  return (
    <div>
      <h2 className="text-xl text-center my-2">Lists</h2>
      <ul>
        {lists.map(list => (
          <SearchResultListItem to={`/lists/${list.id}`}>
            <span className="text-xl text-emerald">{list.name}</span>
            <span className="text-lg text-black">by {list.creator.user.username}</span>
            <div className="flex items-center">
              <span className="font-bold mr-1">{list.favCount} <span className="sr-only">favorites</span></span> 
              <MdFavorite className="text-red-700 text-xl" />
            </div>
          </SearchResultListItem>
        ))}
      </ul>
    </div>
  );
};