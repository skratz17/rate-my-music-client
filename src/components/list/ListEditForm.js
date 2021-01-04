import React from 'react';
import { Redirect } from 'react-router-dom';

import { api } from '../../api';
import { useApi, useIsUser } from '../../hooks';
import { LoadingIndicator, WarningText } from '../common';
import { ListForm } from './ListForm';

export const ListEditForm = props => {
  const { listId } = props;

  const [ list, isLoading, error ] = useApi(api.lists.get, listId);
  const isUserCreatedList = useIsUser(list?.creator?.id);

  if(isUserCreatedList === false) {
    return <Redirect to="/" />;
  }

  return <>
    <LoadingIndicator isLoading={isLoading} />
    <WarningText>{error}</WarningText>
    { list && isUserCreatedList && <ListForm list={{
      id: list.id,
      name: list.name,
      description: list.description,
      songs: list.songs.map(listSong => ({
        songId: listSong.song.id,
        name: listSong.song.name,
        description: listSong.description
      }))
    }} /> }
  </>;
};