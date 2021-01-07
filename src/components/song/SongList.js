import React from 'react';
import { Link } from 'react-router-dom';

import { roundToAtMostDecimalPlaces } from '../../utils';

export const SongList = props => {
  const { songs } = props;

  if(!songs.length) {
    return <p className="italic my-2">No songs were found.</p>;
  }

  return (
    <ul>
      {songs.map(song => {
        const rating = song.rating || song.avgRating;

        return (
          <li key={song.id} className="my-3 flex justify-between">
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl">
                <Link className="text-deepred hover:text-deepred-dark" to={`/songs/${song.id}`}>{song.name}</Link>
              </h3>
              <h4 className="text-lg">
                <Link className="text-black hover:text-deepred" to={`/artists/${song.artist.id}`}>{song.artist.name}</Link>
              </h4>
            </div>

            <div className="flex items-center text-2xl">
              {  rating ? roundToAtMostDecimalPlaces(rating, 2) : '--' } / 5
            </div>
          </li>
        );
      })}
    </ul>
  )
};