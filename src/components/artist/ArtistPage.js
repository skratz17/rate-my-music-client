import React, { useState } from 'react';

import { api } from '../../api';
import { useApi, useDeleteAndRedirect, usePagination, useIsUser } from '../../hooks';
import { PlayButton } from '../player/PlayButton';
import { SongList } from '../song/SongList';
import { Page, LoadingWrapper, WarningText, ListSortOptions, PaginationControls, LinkButton, DeleteButton } from '../common';

export const ArtistPage = props => {
  const { artistId } = props;

  const [ orderBy, setOrderBy ] = useState({ orderBy: 'year', direction: 'desc' });
  const [ paginationParams, paginationFunctions ] = usePagination();
  const [ artist, isArtistLoading, artistError ] = useApi(api.artists.get, artistId);
  const [ songsResponse, isSongsLoading, songsError ] = useApi(api.songs.list, { artist: artistId, ...orderBy, ...paginationParams });

  const [ handleDelete, deleteError ] = useDeleteAndRedirect(api.artists.delete, artistId);

  const isUserCreatedArtist = useIsUser(artist?.creator?.id);

  const songs = songsResponse?.data;
  const songsCount = songsResponse?.count;

  const handleSelectSortOption = sortOption => {
    setOrderBy(sortOption);
    paginationFunctions.getPage(1);
  };

  const renderArtistData = () => {
    if(!artist) return null;
    return (
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl text-deepred my-2">{artist.name}</h2>
          <p className="text-xl my-2">Founded: {artist.foundedYear}</p>
          <p>{artist.description}</p>
        </div>
        { isUserCreatedArtist && (
          <div className="flex">
            <LinkButton className="mr-2" to={`/artists/${artistId}/edit`}>edit</LinkButton>
            <DeleteButton onDelete={handleDelete} accessibleName="Delete Artist" />
          </div>
        )}
      </div>
    );
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
        <ListSortOptions orderingData={orderBy} fields={songListSortOptions} onSelectSortOption={handleSelectSortOption} />
      </div>
      <div>
        <SongList songs={songs} />
        <PaginationControls page={paginationParams.page}
          pageSize={paginationParams.pageSize}
          isLastPage={paginationFunctions.isLastPage(songsCount)}
          onSetPageSize={paginationFunctions.setPageSize}
          onPreviousPage={paginationFunctions.getPreviousPage}
          onNextPage={paginationFunctions.getNextPage} />
      </div>
    </>;
  };

  return (
    <Page>
      <section>
        <LoadingWrapper isLoading={isArtistLoading}>
          <WarningText>{artistError}</WarningText>
          <WarningText>{deleteError}</WarningText>
          { renderArtistData() }
        </LoadingWrapper>
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        <LoadingWrapper isLoading={isSongsLoading}>
          <WarningText>{songsError}</WarningText>
          { renderSongsData() }
        </LoadingWrapper>
      </section>
    </Page>
  )
};