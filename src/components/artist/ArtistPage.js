import React from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { LoadingIndicator, WarningText } from '../common';

export const ArtistPage = props => {
  const { artistId } = props;

  const [ artist, isArtistLoading, artistError ] = useApi(api.artists.get, artistId);

  const renderArtistData = () => {
    if(!artist) return null;
    return (
      <section>
        <h2 className="text-4xl text-deepred my-2">{artist.name}</h2>
        <p className="text-xl my-2">Founded: {artist.foundedYear}</p>
        <p>{artist.description}</p>
      </section>
    )
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <WarningText>{artistError}</WarningText>
      <LoadingIndicator isLoading={isArtistLoading} />
      { renderArtistData() }
    </div>
  )
};