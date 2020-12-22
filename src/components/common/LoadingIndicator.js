import React from 'react';

import loadingGif from '../../assets/loading.gif';

export const LoadingIndicator = props => {
  const { isLoading } = props;

  if(!isLoading) return null;
  return (
    <div className="flex flex-col justify-center items-center">
      <small className="italic my-1">Loading...</small>
      <img src={loadingGif} alt="" className="w-8 h-8" />
    </div>
  );
};