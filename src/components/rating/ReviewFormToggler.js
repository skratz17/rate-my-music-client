import React, { useState } from 'react';
import { MdChevronRight } from 'react-icons/md';

import { ReviewForm } from './ReviewForm';

export const ReviewFormToggler = props => {
  const { rating, onSubmit } = props;

  const [ isExpanded, setIsExpanded ] = useState(false);
  const isVisible = !!rating;

  const handleSubmit = review => {
    onSubmit(review);
    setIsExpanded(false);
  };

  return (
    <div className="w-full">
      <div style={{ height: isVisible ? '2rem' : '0' }}
        className="transition-all overflow-hidden flex justify-center md:justify-start">
          { isVisible && 
            <button className="flex items-center h-8 px-2 bg-gray-200 hover:bg-gray-300" onClick={() => setIsExpanded(prevExpanded => !prevExpanded)}>
              <span>Write a Review</span>
              <MdChevronRight className={`text-xl transition-all transform ${isExpanded ? 'rotate-90' : ''}`}/>
              <span className="sr-only"> ({isExpanded ? 'expanded' : 'collapsed'})</span>
            </button>
          }
      </div>
      <div className="w-full">
          { isExpanded && <ReviewForm review={rating?.review} onSubmit={handleSubmit} /> }
      </div>
    </div>
  );
};