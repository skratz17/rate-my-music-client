import React from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { LoadingIndicator, WarningText } from '../common';
import { SongForm } from './SongForm';

export const SongEditForm = props => {
  const { songId } = props;

  const [ song, isLoading, error ] = useApi(api.songs.get, songId);

  return <>
    <LoadingIndicator isLoading={isLoading} />
    <WarningText>{error}</WarningText>
    { song && <SongForm song={{
      id: song.id,
      name: song.name,
      artist: song.artist,
      year: song.year,
      genres: song.genres.map(g => g.genre),
      sources: song.sources.map(({ service, url, isPrimary }) => ({ service, url, isPrimary }))
    }} /> }
  </>;
};