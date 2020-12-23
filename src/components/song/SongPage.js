import React, { useState, useContext } from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { UserContext } from '../user/UserProvider';
import { LoadingIndicator, WarningText, ListSortOptions } from '../common';
import { SongDetail } from './SongDetail';
import { RatingControl } from '../rating/RatingControl';
import { RatingList } from '../rating/RatingList';
import { ListList } from '../list/ListList';

export const SongPage = props => {
  const { songId } = props;

  const { user } = useContext(UserContext);

  const allRatingSortOptions = [
    { name: 'date', displayName: 'Date' },
    { name: 'rating', displayName: 'Rating' }
  ];
  const [ ratingSortOptions, setRatingSortOptions ] = useState({ orderBy: 'date', direction: 'desc' });

  const [ song, isSongLoading, songError, refreshSong ] = useApi(api.songs.get, songId);
  const [ ratings, isRatingsLoading, ratingsError, refreshRatings ] = useApi(api.ratings.list, { songId, ...ratingSortOptions });
  const [ lists, isListsLoading, listsError ] = useApi(api.lists.list, { songId });

  const userRating = ratings?.find(r => r.rater.id === user?.id);

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
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <section>
        <WarningText>{songError}</WarningText>
        <LoadingIndicator isLoading={!song && isSongLoading} />
        { song && <SongDetail song={song} /> }
        { ratings && <RatingControl value={userRating?.rating} onClick={rateSong} /> }
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
        { ratings && <RatingList ratings={ratings} /> }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        <WarningText>{listsError}</WarningText>
        <LoadingIndicator isLoading={isListsLoading} />
        <h3 className="text-2xl">Appears in Lists</h3>
        { lists && <ListList lists={lists} /> }
      </section>
    </div>
  )
};