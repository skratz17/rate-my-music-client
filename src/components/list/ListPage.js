import React from 'react';

import { api } from '../../api';
import { useApi, useDeleteAndRedirect, useIsUser } from '../../hooks';
import { Page, LoadingIndicator, WarningText, LinkButton, DeleteButton } from '../common';
import { ListDetail } from './ListDetail';
import { ListSongList } from './ListSongList';
import { ListFavoriteControl } from './ListFavoriteControl';

export const ListPage = props => {
  const { listId } = props;

  const [ list, isLoading, error, refreshList ] = useApi(api.lists.get, listId);
  const [ handleDelete, deleteError ] = useDeleteAndRedirect(api.lists.delete, listId);

  const isUserCreatedList = useIsUser(list?.creator?.id);

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
    <Page>
      <section>
        <LoadingIndicator isLoading={!list && isLoading} />
        <WarningText>{error}</WarningText>
        <WarningText>{deleteError}</WarningText>
        { list && 
          <div className="flex justify-between items-start">
            <ListDetail list={list} />
            <div className="flex">
              {
                isUserCreatedList && 
                  <>
                    <LinkButton className="mr-2" to={`/lists/${listId}/edit`}>edit</LinkButton>
                    <DeleteButton className="mr-2" onDelete={handleDelete} accessibleName="Delete List" />
                  </>
              }
              <ListFavoriteControl favCount={list.favCount} 
                isFavorited={list.hasRaterFavorited}
                onClick={handleFavoriteClick} />
            </div>
          </div>
        }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        { list && <ListSongList listSongs={list.songs} /> }
      </section>
    </Page>
  );
};