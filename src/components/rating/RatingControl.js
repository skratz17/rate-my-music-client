import React, { useEffect, useState } from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';

const RATING_VALUES = [ 1, 2, 3, 4, 5 ];

export const RatingControl = props => {
  const { value, onClick } = props;

  const [ hoveredValue, setHoveredValue ] = useState(value);

  useEffect(() => {
    setHoveredValue(value);
  }, [ value ]);

  return (
    <div className="flex" onMouseOut={() => setHoveredValue(value)} onBlur={() => setHoveredValue(value)}>
      { RATING_VALUES.map(starValue => (
        <div key={starValue} className="relative flex justify-center items-center w-8 h-8">
          <button className="absolute w-full h-full top-0 left-0" 
            onClick={() => onClick(starValue)}
            onFocus={() => setHoveredValue(starValue)}
            onMouseOver={() => setHoveredValue(starValue)}>
              <span className="sr-only">Rate song {starValue} out of 5</span>
          </button>
          <span className="text-2xl">{ hoveredValue >= starValue ? <MdStar data-testid="filled-star" /> : <MdStarBorder data-testid="empty-star" /> }</span>
        </div>
      ))}
    </div>
  );
};