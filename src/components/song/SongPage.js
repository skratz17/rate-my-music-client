import React, { useState, useContext } from 'react';

import { api } from '../../api';
import { useApi, usePagination } from '../../hooks';
import { UserContext } from '../user/UserProvider';
import { Page, LoadingIndicator, WarningText, ListSortOptions, PaginationControls } from '../common';
import { SongDetail } from './SongDetail';
import { RatingControl } from '../rating/RatingControl';
import { RatingList } from '../rating/RatingList';
import { ListList } from '../list/ListList';
import { ReviewFormToggler } from '../rating/ReviewFormToggler';

export const SongPage = props => {
  const { songId } = props;

  const { user } = useContext(UserContext);

  const allRatingSortOptions = [
    { name: 'date', displayName: 'Date' },
    { name: 'rating', displayName: 'Rating' }
  ];
  const [ ratingSortOptions, setRatingSortOptions ] = useState({ orderBy: 'date', direction: 'desc' });

  const [ ratingsPaginationParams, ratingsPaginationFunctions ] = usePagination();
  const [ listsPaginationParams, listsPaginationFunctions ] = usePagination();

  const [ song, isSongLoading, songError, refreshSong ] = useApi(api.songs.get, songId);
  const [ ratingsResponse, isRatingsLoading, ratingsError, refreshRatings ] = useApi(api.ratings.list, { songId, ...ratingSortOptions, ...ratingsPaginationParams });
  const [ listsResponse, isListsLoading, listsError ] = useApi(api.lists.list, { songId, ...listsPaginationParams });

  const ratings = ratingsResponse?.data;
  const ratingsCount = ratingsResponse?.count;

  const lists = listsResponse?.data;
  const listsCount = listsResponse?.count;

  const [ userRatingResult, isUserRatingLoading, isUserRatingError, refreshUserRating ] = useApi(
    async (...params) => {
      if(user?.id) {
        return await api.ratings.list(...params);
      }
    },
    { userId: user?.id, songId: songId }
  );

  const userRating = userRatingResult?.data ? userRatingResult.data[0] : null;

  const rateSong = async value => {
    if(value === userRating?.rating) return;

    if(userRating) {
      await api.ratings.update(userRating.id, { songId, rating: value, review: userRating.review || '' });
    }
    else {
      await api.ratings.create({ songId, rating: value, review: '' });
    }

    refreshSong();
    refreshRatings();
    refreshUserRating();
  };

  const reviewSong = async review => {
    if(review === userRating?.review) return;

    await api.ratings.update(userRating.id, { songId, rating: userRating.rating, review: review });

    refreshRatings();
    refreshUserRating();
  };

  return (
    <Page>
      <section>
        <WarningText>{songError}</WarningText>
        <LoadingIndicator isLoading={!song && isSongLoading} />
        { song && <SongDetail song={song} /> }
        { ratings && <RatingControl value={userRating?.rating} onClick={rateSong} /> }
        { ratings && <ReviewFormToggler rating={userRating} onSubmit={reviewSong} /> }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        <WarningText>{ratingsError}</WarningText>
        <LoadingIndicator isLoading={!ratings && isRatingsLoading} />
        <div className="flex justify-between">
          <h3 className="text-2xl">Ratings and Reviews</h3>
          <ListSortOptions fields={allRatingSortOptions} 
            orderingData={ratingSortOptions} 
            onSelectSortOption={setRatingSortOptions} />
        </div>
        { ratings && 
        <div>
          <RatingList ratings={ratings} /> 
          <PaginationControls page={ratingsPaginationParams.page}
            pageSize={ratingsPaginationParams.pageSize}
            isLastPage={ratingsPaginationFunctions.isLastPage(ratingsCount)}
            onSetPageSize={ratingsPaginationFunctions.setPageSize}
            onPreviousPage={ratingsPaginationFunctions.getPreviousPage}
            onNextPage={ratingsPaginationFunctions.getNextPage} />
        </div>
        }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        <WarningText>{listsError}</WarningText>
        <LoadingIndicator isLoading={!lists && isListsLoading} />
        <h3 className="text-2xl">Appears in Lists</h3>
        { lists && 
          <div>
            <ListList lists={lists} /> 
            <PaginationControls page={listsPaginationParams.page}
              pageSize={listsPaginationParams.pageSize}
              isLastPage={listsPaginationFunctions.isLastPage(listsCount)}
              onSetPageSize={listsPaginationFunctions.setPageSize}
              onPreviousPage={listsPaginationFunctions.getPreviousPage}
              onNextPage={listsPaginationFunctions.getNextPage} />
          </div>
        }
      </section>
    </Page>
  )
};