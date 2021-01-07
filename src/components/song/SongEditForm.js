import React from 'react';
import { Redirect } from 'react-router-dom';

import { api } from '../../api';
import { useApi, useIsUser } from '../../hooks';
import { LoadingWrapper, WarningText } from '../common';
import { SongForm } from './SongForm';

export const SongEditForm = props => {
  const { songId } = props;

  const [ song, isLoading, error ] = useApi(api.songs.get, songId);
  const isUserCreatedSong = useIsUser(song?.creator?.id);

  if(isUserCreatedSong === false) {
    return <Redirect to="/" />;
  }

  return (
    <LoadingWrapper isLoading={isLoading}>
      <WarningText>{error}</WarningText>
      { song && isUserCreatedSong && <SongForm song={{
        id: song.id,
        name: song.name,
        artist: song.artist,
        year: song.year,
        genres: song.genres.map(g => g.genre),
        sources: song.sources.map(({ service, url, isPrimary }) => ({ service, url, isPrimary }))
      }} /> }
    </LoadingWrapper>
  );
};