import React from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { LoadingIndicator, WarningText } from '../common';
import { ArtistForm } from './ArtistForm';

export const ArtistEditForm = props => {
  const { artistId } = props;

  const [ artist, isLoading, error ] = useApi(api.artists.get, artistId);

  return <>
    <LoadingIndicator isLoading={isLoading} />
    <WarningText>{error}</WarningText>
    { artist && <ArtistForm artist={artist} /> }
  </>;
};