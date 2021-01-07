import React from 'react';

import loadingGif from '../../assets/loading.gif';

export const LoadingWrapper = props => {
  const { isLoading } = props;

  return (
    <div className="relative" style={{ minHeight: isLoading ? '300px' : '0' }}>
      { isLoading && 
          <div className="absolute z-10 top-0 left-0 w-full h-full bg-white bg-opacity-40 flex justify-center items-center">
            <div className="bg-gray-200 bg-opacity-50 p-5 rounded">
              <div className="flex flex-col justify-center items-center">
                <span className="italic my-1 text-xl">Loading...</span>
                <img src={loadingGif} alt="Loading Indicator" className="h-32 w-32" />
              </div>
            </div>
          </div>
      }
      { props.children }
    </div>
  );
};