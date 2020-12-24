import React, { useState } from 'react';

import { api } from '../../api';
import { DelayedSearchBar } from '../common';
import { ArtistSearchResultsList } from '../artist/ArtistSearchResultsList';
import { SongSearchResultsList } from '../song/SongSearchResultsList';
import { ListSearchResultsList } from '../list/ListSearchResultsList';

export const FullSearch = () => {
  const [ results, setResults ] = useState(null);

  return (
    <div>
      <DelayedSearchBar placeholder="Seach for an artist, song, or list"
        className="p-4 text-lg"
        name="full-search-bar"
        onSearch={api.search.search}
        onResults={setResults} />
      { results && 
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center content-center gap-2">
          <ArtistSearchResultsList artists={results.artists} />
          <SongSearchResultsList songs={results.songs} />
          <ListSearchResultsList lists={results.lists} />
        </div>
      }
    </div>
  );
};