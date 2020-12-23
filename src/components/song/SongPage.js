import React from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { LoadingIndicator, WarningText } from '../common';
import { SongDetail } from './SongDetail';

export const SongPage = props => {
  const { songId } = props;

  const [ song, isSongLoading, songError ] = useApi(api.songs.get, songId);
  const [ ratings, isRatingsLoading, ratingsError ] = useApi(api.ratings.list, { songId });
  const [ lists, isListsLoading, listsError ] = useApi(api.lists.list, { songId });

  const renderRatingsData = () => {
    if(!ratings) return null;
    return <>
      <h3>Ratings and Reviews</h3>
      { ratings.map(r => <p key={r.id}>{r.review}</p>) }
    </>;
  };

  const renderListsData = () => {
    if(!lists) return null;
    return <>
      <h3>Lists</h3>
      { lists.map(l => <p key={l.id}>{l.name}</p>) }
    </>;
  };

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
        <LoadingIndicator isLoading={isRatingsLoading} />
        { renderRatingsData() }
      </section>

      <hr className="w-3/4 h-1 mx-auto my-5" />

      <section>
        <WarningText>{listsError}</WarningText>
        <LoadingIndicator isLoading={isListsLoading} />
        { renderListsData() }
      </section>
    </div>
  )
};