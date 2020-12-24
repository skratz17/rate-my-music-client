import React from 'react';
import { SearchResultListItem } from '../search/SearchResultListItem';

export const SongSearchResultsList = props => {
  const { songs } = props;

  if(!songs.length) {
    return <p className="italic my-2 text-center">There are no songs to display.</p>
  }

  return (
    <div>
      <h2 className="text-xl text-center my-2">Songs</h2>
      <ul>
        {songs.map(song => (
          <SearchResultListItem key={song.id} to={`/songs/${song.id}`}>
            <span className="text-xl text-deepred">{song.name}</span>
            <span className="text-lg text-black">{song.artist.name}</span>
          </SearchResultListItem>
        ))}
      </ul>
    </div>
  );
};