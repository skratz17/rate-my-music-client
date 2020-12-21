import React, { useState } from 'react';

import { DelayedSearchBar } from './DelayedSearchBar';

export const AutocompleteSearchBar = props => {
  const { onSearch, onSelect, className, name, removeOnSelect } = props;

  const [ results, setResults ] = useState([]);

  const handleResults = _results => {
    setResults(_results ? _results : []);
  };

  const handleSelect = result => {
    onSelect(result);
    if(removeOnSelect) handleResults(results.filter(r => r.id !== result.id));
  };

  return (
    <div className="flex flex-col">
      <DelayedSearchBar className={className} name={name} onSearch={onSearch} onResults={handleResults} />
      { results.length > 0 && 
        <ul>
          { results.map(result => (
            <li className="border-t border-gray-400" key={result.id}>
              <button className="w-full p-2 text-left bg-gray-200 hover:bg-gray-300" onClick={() => handleSelect(result)}>
                {result.name}
              </button>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};