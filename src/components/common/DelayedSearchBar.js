import React, { useState, useEffect } from 'react';

import { useApi, useDebounce } from '../../hooks';
import loadingGif from '../../assets/loading.gif';

export const DelayedSearchBar = props => {
  const { duration, onSearch, onResults, name, className } = props;

  const [ searchTerm, setSearchTerm ] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, duration || 500);

  const [ results, isLoading ] = useApi(async _debouncedSearchTerm => {
    if(_debouncedSearchTerm) {
      return await onSearch(_debouncedSearchTerm);
    }
  }, debouncedSearchTerm);

  useEffect(() => {
    onResults(results);
  }, [ results ]);

  return (
    <div className="flex items-center relative">
      <input name={name} id={name} className={`flex-grow ${className || ''}`} type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      { <div style={((searchTerm !== debouncedSearchTerm) || isLoading) ? { backgroundImage: `url(${loadingGif})`} : {}} className="bg-cover h-6 w-6 mx-2 flex-grow-0 absolute right-0" /> }
    </div>
  );
};