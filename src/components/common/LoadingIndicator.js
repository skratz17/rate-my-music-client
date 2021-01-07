import React from 'react';

import loadingGif from '../../assets/loading.gif';

export const LoadingIndicator = props => {
  const { isLoading, size } = props;

  if(!isLoading) return null;
  return (
    <div className="flex flex-col justify-center items-center">
      <small className={`italic my-1 ${size === 'large' ? 'text-xl' : ''}`}>Loading...</small>
      <img src={loadingGif} alt="" className={size === 'large' ? 'h-32 w-32': 'h-8 w-8'} />
    </div>
  );
};