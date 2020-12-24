import React from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';

export const DisplayStars = props => {
  const { value } = props;

  const stars = Array(5)
    .fill(<MdStar data-testid="filled-star" />, 0, value)
    .fill(<MdStarBorder data-testid="empty-star" />, value, 5);

  return (
    <div className="flex">
      { stars.map((star, idx) => <span key={idx} className="text-xl">{star}</span>) }
      <span className="sr-only">{value} stars out of 5</span>
    </div>
  );
};