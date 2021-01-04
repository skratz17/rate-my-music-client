import React from 'react';
import { Redirect } from 'react-router-dom';

import { api } from '../../api';
import { useApi, useIsUser } from '../../hooks';
import { LoadingIndicator, WarningText } from '../common';
import { ArtistForm } from './ArtistForm';

export const ArtistEditForm = props => {
  const { artistId } = props;

  const [ artist, isLoading, error ] = useApi(api.artists.get, artistId);
  const isUserCreatedArtist = useIsUser(artist?.creator?.id);

  if(isUserCreatedArtist === false) {
    return <Redirect to="/" />;
  }

  return <>
    <LoadingIndicator isLoading={isLoading} />
    <WarningText>{error}</WarningText>
    { artist && isUserCreatedArtist && <ArtistForm artist={artist} /> }
  </>;
};