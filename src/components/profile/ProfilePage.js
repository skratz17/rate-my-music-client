import React, { useState } from 'react';

import { api } from '../../api';
import { usePagination, useApi } from '../../hooks';
import { SongList } from '../song/SongList';
import { ListList } from '../list/ListList';
import { PlayButton } from '../player/PlayButton';
import { Page, LoadingIndicator, WarningText, ListSortOptions, PaginationControls } from '../common';

export const ProfilePage = props => {
  const { userId } = props;

  const allRatingSortOptions = [
    { name: 'date', displayName: 'Date' },
    { name: 'rating', displayName: 'Rating' }
  ];
  const [ ratingSortOptions, setRatingSortOptions ] = useState({ orderBy: 'date', direction: 'desc' });
  const [ listSearchParams, setListSearchParams ] = useState({ userId: userId });

  const [ ratingPaginationParams, ratingPaginationFunctions ] = usePagination();
  const [ listPaginationParams, listPaginationFunctions ] = usePagination();

  const [ user, isUserLoading, userError ] = useApi(api.user.get, userId);
  const [ ratingsResponse, isRatingsLoading, ratingsError ] = useApi(api.ratings.list, { userId: userId, ...ratingSortOptions, ...ratingPaginationParams })
  const [ listsResponse, isListsLoading, listsError ] = useApi(api.lists.list, { ...listSearchParams, ...listPaginationParams });

  const ratings = ratingsResponse?.data;
  const ratingsCount = ratingsResponse?.count;

  const lists = listsResponse?.data;
  const listsCount = listsResponse?.count;

  const handleListSearchParamClick = e => {
    const { name } = e.target;
    if(name === 'userId') setListSearchParams({ userId });
    else if(name === 'favoritedBy') setListSearchParams({ favoritedBy: userId });

    listPaginationFunctions.getPage(1);
  };

  const handleRatingSort = sortOptions => {
    setRatingSortOptions(sortOptions);
    ratingPaginationFunctions.getPage(1);
  };

  return (
    <Page>
      <section>
        <LoadingIndicator isLoading={isUserLoading} />
        <WarningText>{userError}</WarningText>
        { user && 
          <div>
            <h2 className="text-4xl mb-2">{user.user.username}</h2>
            <p className="text-lg">{user.bio}</p>
          </div>
        }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section className="my-4">
        <LoadingIndicator isLoading={!ratings && isRatingsLoading} />
        <WarningText>{ratingsError}</WarningText>
        <div className="flex justify-between">
          <div className="flex items-center">
            <h3 className="mr-2 text-3xl text-deepred">Ratings</h3>
            { ratings && <PlayButton className="text-5xl" songs={ratings.map(r => r.song)} /> }
          </div>
          <ListSortOptions fields={allRatingSortOptions} 
            orderingData={ratingSortOptions}
            onSelectSortOption={handleRatingSort} />
        </div>

        { ratings && 
          <div>
            <SongList songs={ratings.map(r => ({ ...r.song, rating: r.rating }))} /> 
            <PaginationControls page={ratingPaginationParams.page}
              pageSize={ratingPaginationParams.pageSize}
              isLastPage={ratingPaginationFunctions.isLastPage(ratingsCount)}
              onSetPageSize={ratingPaginationFunctions.setPageSize}
              onPreviousPage={ratingPaginationFunctions.getPreviousPage}
              onNextPage={ratingPaginationFunctions.getNextPage} />
          </div>
        }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section className="my-4">
        <LoadingIndicator isLoading={!lists && isListsLoading} />
        <WarningText>{listsError}</WarningText>
        <div className="flex justify-between">
          <h3 className="text-3xl text-emerald">Lists</h3>

          <div className="flex items-center">
            <div className="flex mx-2">
              <input type="radio" 
                className="mr-2"
                id="userId" name="userId"
                checked={listSearchParams.userId !== undefined} 
                onChange={handleListSearchParamClick} />
              <label htmlFor="userId">Lists Created by { user?.user.username }</label>
            </div>

            <div className="flex mx-2">
              <input type="radio" 
                className="mr-2"
                id="favoritedBy" name="favoritedBy"
                checked={listSearchParams.favoritedBy !== undefined} 
                onChange={handleListSearchParamClick} />
              <label htmlFor="favoritedBy">{ user?.user.username }'s Favorites</label>
            </div>
          </div>
        </div>

        { lists && 
          <div>
            <ListList lists={lists} /> 
            <PaginationControls page={listPaginationParams.page}
              pageSize={listPaginationParams.pageSize}
              isLastPage={listPaginationFunctions.isLastPage(listsCount)}
              onSetPageSize={listPaginationFunctions.setPageSize}
              onPreviousPage={listPaginationFunctions.getPreviousPage}
              onNextPage={listPaginationFunctions.getNextPage} />
          </div>
        }
      </section>
    </Page>
  );
};