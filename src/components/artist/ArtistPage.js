import React from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { SongList } from '../song/SongList';
import { LoadingIndicator, WarningText } from '../common';

export const ArtistPage = props => {
  const { artistId } = props;

  const [ artist, isArtistLoading, artistError ] = useApi(api.artists.get, artistId);
  const [ songs, isSongsLoading, songsError ] = useApi(api.songs.list, { artist: artistId });

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
      <h2 className="text-3xl">Songs</h2>
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
        <LoadingIndicator isLoading={isSongsLoading} />
        { renderSongsData() }
      </section>
    </div>
  )
};