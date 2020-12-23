import React, { useState, useEffect } from 'react';

import { DelayedSearchBar } from './DelayedSearchBar';

export const AutocompleteSearchBar = props => {
  const { onSearch, onSelect, className, name, placeholder, removeOnSelect, resultFormatter } = props;

  const [ results, setResults ] = useState([]);
  const [ isRefreshing, setIsRefreshing ] = useState(false);

  useEffect(() => {
    if(isRefreshing) {
      const timeoutId = setTimeout(() => setIsRefreshing(false), 10);

      return () => clearTimeout(timeoutId);
    }
  }, [ isRefreshing ]);

  const handleResults = _results => {
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
    <div className="flex flex-col">
      { !isRefreshing && <DelayedSearchBar className={className} 
        name={name} 
        placeholder={placeholder}
        onSearch={onSearch} 
        onResults={handleResults} /> }
      { results.length > 0 && 
        <ul>
          { results.map(result => (
            <li className="border-t border-gray-400" key={result.id}>
              <button className="w-full p-2 text-left bg-gray-200 hover:bg-gray-300" onClick={() => handleSelect(result)}>
                { resultFormatter ? resultFormatter(result) : result.name }
              </button>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};