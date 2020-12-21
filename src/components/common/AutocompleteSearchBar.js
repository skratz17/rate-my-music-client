import React, { useState } from 'react';

import { DelayedSearchBar } from './DelayedSearchBar';

export const AutocompleteSearchBar = props => {
  const { onSearch, onSelect } = props;

  const [ results, setResults ] = useState([]);

  const handleResults = _results => {
    setResults(_results ? _results : []);
  };

  return (
    <div>
      <DelayedSearchBar onSearch={onSearch} onResults={handleResults} />
      { results.length > 0 && 
        <ul>
          { results.map(result => (
            <li key={result.id}>
              <button onClick={() => onSelect(result)}>
                {result.name}
              </button>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};