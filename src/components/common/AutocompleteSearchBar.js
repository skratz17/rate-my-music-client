import React, { useState, useRef } from 'react';

import { DelayedSearchBar } from './DelayedSearchBar';
import { useClickOutside, useClickInside } from '../../hooks';

export const AutocompleteSearchBar = props => {
  const { onSearch, onSelect, className, name, placeholder, removeOnSelect, resultFormatter } = props;

  const [ results, setResults ] = useState([]);
  const [ areResultsShowing, setAreResultsShowing ] = useState(true);
  const [ searchBarKey, setSearchBarKey ] = useState(1);

  const searchBarComponentRef = useRef();
  useClickOutside(searchBarComponentRef, () => setAreResultsShowing(false));
  useClickInside(searchBarComponentRef, () => setAreResultsShowing(true));

  const handleResults = _results => {
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
      { results.length > 0 && areResultsShowing &&
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