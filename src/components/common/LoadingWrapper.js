import React from 'react';

import { LoadingIndicator } from './LoadingIndicator';

export const LoadingWrapper = props => {
  const { isLoading } = props;

  return (
    <div className="relative" style={{ minHeight: '300px' }}>
      { isLoading && 
          <div className="absolute z-10 top-0 left-0 w-full h-full bg-white bg-opacity-40 flex justify-center items-center">
            <div className="bg-gray-200 bg-opacity-50 p-5 rounded">
              <LoadingIndicator isLoading={isLoading} size="large" />
            </div>
          </div>
      }
      { props.children }
    </div>
  );
};