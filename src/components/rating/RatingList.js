import React from 'react';
import { Link } from 'react-router-dom';

import { DisplayStars } from './DisplayStars';

export const RatingList = props => {
  const { ratings } = props;

  if(!ratings.length) {
    return <p className="italic">There are no ratings to display.</p>;
  }

  return (
    <ul>
      { ratings.map(rating => (
        <li key={rating.id} className="flex flex-col my-3">
          <div className="flex items-center">
            <Link to={`/profiles/${rating.rater.id}`} className="text-black hover:text-deepred text-lg mr-2">
              {rating.rater.user.username}
            </Link>

            <DisplayStars value={rating.rating} />
          </div>

          <p>{rating.review}</p>
        </li>
      ))}
    </ul>
  );
};