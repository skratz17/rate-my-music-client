import React, { useState } from 'react';

import { api } from '../../api';
import { useApi, usePagination } from '../../hooks';
import { PlayButton } from '../player/PlayButton';
import { SongList } from '../song/SongList';
import { Page, LoadingIndicator, WarningText, ListSortOptions, PaginationControls } from '../common';

export const ArtistPage = props => {
  const { artistId } = props;

  const [ orderBy, setOrderBy ] = useState({ orderBy: 'year', direction: 'desc' });
  const [ paginationParams, paginationFunctions ] = usePagination();
  const [ artist, isArtistLoading, artistError ] = useApi(api.artists.get, artistId);
  const [ songsResponse, isSongsLoading, songsError ] = useApi(api.songs.list, { artist: artistId, ...orderBy, ...paginationParams });

  const songs = songsResponse?.data;
  const songsCount = songsResponse?.count;

  const renderArtistData = () => {
    if(!artist) return null;
    return <>
      <h2 className="text-4xl text-deepred my-2">{artist.name}</h2>
      <p className="text-xl my-2">Founded: {artist.foundedYear}</p>
      <p>{artist.description}</p>
    </>;
  };

  const renderSongsData = () => {
    if(!songs) return null;

    const songListSortOptions = [
      { name: 'year', displayName: 'Year' },
      { name: 'name', displayName: 'Name' },
      { name: 'avgRating', displayName: 'Average Rating' },
    ];

    return <>
      <div className="flex justify-between">
        <div className="flex items-center">
          <h2 className="mr-2 text-3xl">Songs</h2>
          <PlayButton className="text-5xl" 
            songs={songs}
            accessibleName={`Play all ${artist?.name} songs`} />
        </div>
        <ListSortOptions orderingData={orderBy} fields={songListSortOptions} onSelectSortOption={setOrderBy} />
      </div>
      <div>
        <SongList songs={songs} />
        <PaginationControls page={paginationParams.page}
          isLastPage={paginationFunctions.isLastPage(songsCount)}
          onPreviousPage={paginationFunctions.getPreviousPage}
          onNextPage={paginationFunctions.getNextPage} />
      </div>
    </>;
  };

  return (
    <Page>
      <section>
        <WarningText>{artistError}</WarningText>
        <LoadingIndicator isLoading={isArtistLoading} />
        { renderArtistData() }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        <WarningText>{songsError}</WarningText>
        <LoadingIndicator isLoading={!songs && isSongsLoading} />
        { renderSongsData() }
      </section>
    </Page>
  )
};