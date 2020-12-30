import React, { useState, useRef, useCallback } from 'react';

import { DelayedSearchBar } from './DelayedSearchBar';
import { useClickOutside, useClickInside } from '../../hooks';

export const AutocompleteSearchBar = props => {
  const { onSearch, onSelect, className, name, placeholder, removeOnSelect, resultFormatter } = props;

  const [ clickOutsideResults, setClickOutsideResults ] = useState(null);
  const [ results, setResults ] = useState([]);
  const [ searchBarKey, setSearchBarKey ] = useState(1);

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

  const handleResults = _results => {
    if(clickOutsideResults) {
      setClickOutsideResults(null);
    }
    setResults(_results ? _results : []);
  };

  const handleSelect = result => {
    onSelect(result);
    if(removeOnSelect) setSearchBarKey(prevSearchBarKey => prevSearchBarKey + 1);
  };

  return (
    <div ref={searchBarComponentRef } className="flex flex-col">
      <DelayedSearchBar className={className} 
        key={searchBarKey}
        name={name} 
        placeholder={placeholder}
        onSearch={onSearch} 
        onResults={handleResults} /> 
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