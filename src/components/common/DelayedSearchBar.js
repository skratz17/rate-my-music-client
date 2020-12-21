import React, { useState, useEffect } from 'react';

import { useApi, useDebounce } from '../../hooks';

export const DelayedSearchBar = props => {
  const { duration, onSearch, onResults } = props;

  const [ searchTerm, setSearchTerm ] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, duration || 500);
  const [ results ] = useApi(async _debouncedSearchTerm => {
    if(_debouncedSearchTerm) {
      return await onSearch(_debouncedSearchTerm)
    }
  }, debouncedSearchTerm);

  useEffect(() => {
    onResults(results);
  }, [ JSON.stringify(results) ]);

  return (
    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
  );
};