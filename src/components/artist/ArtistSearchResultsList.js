import React from 'react';
import { SearchResultListItem } from '../search/SearchResultListItem';

export const ArtistSearchResultsList = props => {
  const { artists } = props;

  if(!artists.length) {
    return <p className="italic my-2 text-center">There are no artists to display.</p>
  }

  return (
    <div>
      <h2 className="text-xl text-center my-2">Artists</h2>
      <ul>
        {artists.map(artist => (
          <SearchResultListItem key={artist.id} to={`/artists/${artist.id}`}>
            <span className="text-xl text-deepred">{artist.name}</span>
          </SearchResultListItem>
        ))}
      </ul>
    </div>
  );
};