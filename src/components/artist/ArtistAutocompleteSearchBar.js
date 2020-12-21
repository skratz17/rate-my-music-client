import React, { useState } from 'react';
import { MdClear } from 'react-icons/md';

import { AutocompleteSearchBar } from '../common';
import { api } from '../../api';

export const ArtistAutocompleteSearchBar = props => {
  const { onSelect, defaultValue } = props;

  const [ selectedValue, setSelectedValue ] = useState(defaultValue);

  if(selectedValue) {
    return (
      <div className="flex">
        <span>{selectedValue.name}</span>
        <button className="bg-red-300 hover:bg-red-400 rounded p-1 mx-2" onClick={() => setSelectedValue(null)}>
          <MdClear />
        </button>
      </div>
    );
  }

  const handleSelect = _selectedValue => {
    onSelect(_selectedValue);
    setSelectedValue(_selectedValue);
  };
  
  return (
    <AutocompleteSearchBar onSearch={api.artists.search} onSelect={handleSelect} />
  );
};