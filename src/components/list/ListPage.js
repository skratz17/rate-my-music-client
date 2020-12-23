import React from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { LoadingIndicator, WarningText } from '../common';
import { ListDetail } from './ListDetail';
import { ListSongList } from './ListSongList';

export const ListPage = props => {
  const { listId } = props;

  const [ list, isLoading, error ] = useApi(api.lists.get, listId);

  return (
    <div className="max-w-screen-lg mx-auto">
      <section>
        <LoadingIndicator isLoading={!list && isLoading} />
        <WarningText>{error}</WarningText>
        { list && <ListDetail list={list} /> }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        { list && <ListSongList listSongs={list.songs} /> }
      </section>
    </div>
  );
};