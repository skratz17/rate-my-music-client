import React, { useState, useContext } from 'react';

import { api } from '../../api';
import { useApi, usePagination, useDeleteAndRedirect, useIsUser } from '../../hooks';
import { UserContext } from '../user/UserProvider';
import { Page, LoadingWrapper, WarningText, ListSortOptions, PaginationControls } from '../common';
import { SongDetail } from './SongDetail';
import { RatingControl } from '../rating/RatingControl';
import { RatingList } from '../rating/RatingList';
import { ListList } from '../list/ListList';
import { ReviewFormToggler } from '../rating/ReviewFormToggler';

export const SongPage = props => {
  const { songId } = props;

  const { user } = useContext(UserContext);

  const [ handleDelete, deleteError ] = useDeleteAndRedirect(api.songs.delete, songId);

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

  const isUserCreatedSong = useIsUser(song?.creator?.id);

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

  const handleRatingSort = sortOptions => {
    setRatingSortOptions(sortOptions);
    ratingsPaginationFunctions.getPage(1);
  };

  return (
    <Page>
      <LoadingWrapper isLoading={!song && isSongLoading}>
        <section>
          <WarningText>{songError}</WarningText>
          <WarningText>{deleteError}</WarningText>
          { song && <SongDetail song={song} onDelete={handleDelete} canUserModify={isUserCreatedSong} /> }
          { ratings && (
            <div className="flex flex-col items-center md:items-start">
              <RatingControl value={userRating?.rating} onClick={rateSong} /> 
              <ReviewFormToggler rating={userRating} onSubmit={reviewSong} /> 
            </div>
          )}
        </section>
      </LoadingWrapper>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        <LoadingWrapper isLoading={isRatingsLoading}>
          <WarningText>{ratingsError}</WarningText>
          <div className="flex justify-between">
            <h3 className="text-2xl">Ratings and Reviews</h3>
            <ListSortOptions fields={allRatingSortOptions} 
              orderingData={ratingSortOptions} 
              onSelectSortOption={handleRatingSort} />
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
        </LoadingWrapper>
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        <LoadingWrapper isLoading={isListsLoading}>
          <WarningText>{listsError}</WarningText>
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
        </LoadingWrapper>
      </section>
    </Page>
  )
};