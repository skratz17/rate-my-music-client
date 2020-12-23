import React, { useState } from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { LoadingIndicator, WarningText, ListSortOptions } from '../common';
import { SongDetail } from './SongDetail';
import { RatingList } from '../rating/RatingList';
import { ListList } from '../list/ListList';

export const SongPage = props => {
  const { songId } = props;

  const allRatingSortOptions = [
    { name: 'date', displayName: 'Date' },
    { name: 'rating', displayName: 'Rating' }
  ];
  const [ ratingSortOptions, setRatingSortOptions ] = useState({ orderBy: 'date', direction: 'desc' });

  const [ song, isSongLoading, songError ] = useApi(api.songs.get, songId);
  const [ ratings, isRatingsLoading, ratingsError ] = useApi(api.ratings.list, { songId, ...ratingSortOptions });
  const [ lists, isListsLoading, listsError ] = useApi(api.lists.list, { songId });

  return (
    <div className="max-w-screen-lg mx-auto">
      <section>
        <WarningText>{songError}</WarningText>
        <LoadingIndicator isLoading={isSongLoading} />
        { song && <SongDetail song={song} /> }
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