import React from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { LoadingIndicator, WarningText } from '../common';
import { ListDetail } from './ListDetail';
import { ListSongList } from './ListSongList';
import { ListFavoriteControl } from './ListFavoriteControl';

export const ListPage = props => {
  const { listId } = props;

  const [ list, isLoading, error, refreshList ] = useApi(api.lists.get, listId);

  const handleFavoriteClick = async () => {
    if(list.hasRaterFavorited) {
      await api.lists.unfavorite(listId);
    }
    else {
      await api.lists.favorite(listId);
    }

    refreshList();
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <section>
        <LoadingIndicator isLoading={!list && isLoading} />
        <WarningText>{error}</WarningText>
        { list && 
          <div className="flex justify-between items-start">
            <ListDetail list={list} />           
            <ListFavoriteControl favCount={list.favCount} 
              isFavorited={list.hasRaterFavorited}
              onClick={handleFavoriteClick} />
          </div>
        }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        { list && <ListSongList listSongs={list.songs} /> }
      </section>
    </div>
  );
};