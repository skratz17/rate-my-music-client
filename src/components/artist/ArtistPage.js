import React, { useContext, useState } from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { PlayButton } from '../player/PlayButton';
import { SongList } from '../song/SongList';
import { SongListSortOptions } from '../song/SongListSortOptions';
import { LoadingIndicator, WarningText } from '../common';

export const ArtistPage = props => {
  const { artistId } = props;

  const [ orderBy, setOrderBy ] = useState({ orderBy: 'year', direction: 'desc' });
  const [ artist, isArtistLoading, artistError ] = useApi(api.artists.get, artistId);
  const [ songs, isSongsLoading, songsError ] = useApi(api.songs.list, { artist: artistId, ...orderBy });

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
    return <>
      <div className="flex justify-between">
        <div className="flex items-center">
          <h2 className="mr-2 text-3xl">Songs</h2>
          <PlayButton className="text-5xl" 
            songs={songs}
            accessibleName={`Play all ${artist?.name} songs`} />
        </div>
        <SongListSortOptions orderingData={orderBy} fields={[ 'year', 'name', 'avgRating' ]} onSelectSortOption={setOrderBy} />
      </div>
      <SongList songs={songs} />
    </>;
  };

  return (
    <div className="max-w-screen-lg mx-auto">
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
    </div>
  )
};