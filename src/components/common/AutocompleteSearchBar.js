import React, { useState, useEffect, useRef } from 'react';

import { DelayedInput } from './DelayedInput';
import { PaginationControls } from './PaginationControls';
import { useClickOutside, useClickInside, usePagination } from '../../hooks';

export const AutocompleteSearchBar = props => {
  const { onSearch, onSelect, className, name, placeholder, removeOnSelect, resultFormatter } = props;

  const [ results, setResults ] = useState([]);
  const [ count, setCount ] = useState(0);
  const [ areResultsShowing, setAreResultsShowing ] = useState(true);
  const [ searchBarKey, setSearchBarKey ] = useState(1);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  const [ paginationParams, paginationFunctions ] = usePagination();

  const searchBarComponentRef = useRef();
  useClickOutside(searchBarComponentRef, () => setAreResultsShowing(false));
  useClickInside(searchBarComponentRef, () => setAreResultsShowing(true));

  useEffect(() => {
    const _search = async () => {
      setIsLoading(true);
      const results = await onSearch({ q: searchTerm, page: paginationParams.page, pageSize: paginationParams.pageSize });
      setIsLoading(false);
      setResults(results?.data || []);
      setCount(results?.count || 0);
    };

    if(searchTerm) {
      _search();
    }
    else {
      setResults([]);
    }
  }, [ paginationParams.page, paginationParams.pageSize, searchTerm ]);

  const handleSelect = result => {
    onSelect(result);
    if(removeOnSelect) {
      setSearchBarKey(prevSearchBarKey => prevSearchBarKey + 1);
      setResults([]);
    }
  };

  const handleDelayedSearchBarChange = searchTerm => {
    paginationFunctions.getPage(1);
    setSearchTerm(searchTerm);
  };

  return (
    <div ref={searchBarComponentRef } className="flex flex-col">
      <DelayedInput className={className} 
        key={searchBarKey}
        name={name} 
        placeholder={placeholder}
        isLoading={isLoading}
        onFocus={() => setAreResultsShowing(true)}
        onDelayedChange={handleDelayedSearchBarChange} />

      { results.length > 0 && areResultsShowing &&
        <ul>
          { results.map(result => (
            <li className="border-t border-gray-400" key={result.id}>
              <button type="button" className="w-full p-2 text-left bg-gray-200 hover:bg-gray-300" onClick={() => handleSelect(result)}>
                { resultFormatter ? resultFormatter(result) : result.name }
              </button>
            </li>
          ))}
          <li className="border-t border-gray-400 bg-gray-200 p-2">
            <PaginationControls page={paginationParams.page}
              pageSize={paginationParams.pageSize}
              isLastPage={paginationFunctions.isLastPage(count)}
              onSetPageSize={paginationFunctions.setPageSize}
              onPreviousPage={paginationFunctions.getPreviousPage}
              onNextPage={paginationFunctions.getNextPage} />
          </li>
        </ul>
      }
    </div>
  );
};