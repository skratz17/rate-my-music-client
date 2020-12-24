import React, { useState } from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { SongList } from '../song/SongList';
import { PlayButton } from '../player/PlayButton';
import { LoadingIndicator, WarningText, ListSortOptions } from '../common';

export const ProfilePage = props => {
  const { userId } = props;

  const allRatingSortOptions = [
    { name: 'date', displayName: 'Date' },
    { name: 'rating', displayName: 'Rating' }
  ];
  const [ ratingSortOptions, setRatingSortOptions ] = useState({ orderBy: 'date', direction: 'desc' });

  const [ user, isUserLoading, userError ] = useApi(api.user.get, userId);
  const [ ratings, isRatingsLoading, ratingsError ] = useApi(api.ratings.list, { userId: userId, ...ratingSortOptions })

  return (
    <div className="max-w-screen-lg mx-auto">
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
            onSelectSortOption={setRatingSortOptions} />
        </div>

        { ratings && <SongList songs={ratings.map(r => ({ ...r.song, rating: r.rating }))} /> }
      </section>
    </div>
  );
};