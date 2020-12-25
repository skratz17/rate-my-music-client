import React, { useState, useEffect, useRef, useCallback } from 'react';

import { DelayedSearchBar } from './DelayedSearchBar';
import { useClickOutside, useClickInside } from '../../hooks';

export const AutocompleteSearchBar = props => {
  const { onSearch, onSelect, className, name, placeholder, removeOnSelect, resultFormatter } = props;

  const [ clickOutsideResults, setClickOutsideResults ] = useState(null);
  const [ results, setResults ] = useState([]);
  const [ isRefreshing, setIsRefreshing ] = useState(false);

  // on click outside, clear results to not show autocomplete options
  // and if there were results and no previously cached click outside results, cache them in clickOutsideResults
  const clickOutsideHandler = useCallback(() => {
    if(!clickOutsideResults && results?.length) { 
      setClickOutsideResults([ ...results ]);
    }
    setResults([]);
  }, [ results, clickOutsideResults, setResults, setClickOutsideResults ]);

  // on click inside, if there were cached clickOutsideResults put them back into results
  // and then clear cached clickOutsideResults
  const clickInsideHandler = useCallback(() => {
    if(clickOutsideResults) {
      setResults([ ...clickOutsideResults ]);
      setClickOutsideResults(null);
    }
  }, [ clickOutsideResults, setResults, setClickOutsideResults ]);

  const searchBarComponentRef = useRef();
  useClickOutside(searchBarComponentRef, clickOutsideHandler);
  useClickInside(searchBarComponentRef, clickInsideHandler);

  useEffect(() => {
    if(isRefreshing) {
      const timeoutId = setTimeout(() => setIsRefreshing(false), 10);

      return () => clearTimeout(timeoutId);
    }
  }, [ isRefreshing ]);

  const handleResults = _results => {
    if(clickOutsideResults) {
      setClickOutsideResults(null);
    }
    setResults(_results ? _results : []);
  };

  const handleSelect = result => {
    onSelect(result);
    if(removeOnSelect) refreshSearchBar();
  };

  // this is a hack that will de-render then re-render the DelayedSearchBar to reset its input value state to empty :/
  // you should do something better than this
  const refreshSearchBar = () => {
    setResults([]);
    setIsRefreshing(true);
  };

  return (
    <div ref={searchBarComponentRef } className="flex flex-col">
      { !isRefreshing && <DelayedSearchBar className={className} 
        name={name} 
        placeholder={placeholder}
        onSearch={onSearch} 
        onResults={handleResults} /> }
      { results.length > 0 && 
        <ul>
          { results.map(result => (
            <li className="border-t border-gray-400" key={result.id}>
              <button type="button" className="w-full p-2 text-left bg-gray-200 hover:bg-gray-300" onClick={() => handleSelect(result)}>
                { resultFormatter ? resultFormatter(result) : result.name }
              </button>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};