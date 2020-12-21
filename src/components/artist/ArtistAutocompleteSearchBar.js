import React, { useState } from 'react';
import { MdClear } from 'react-icons/md';

import { AutocompleteSearchBar } from '../common';
import { api } from '../../api';

export const ArtistAutocompleteSearchBar = props => {
  const { onSelect, defaultValue, className, name } = props;

  const [ selectedValue, setSelectedValue ] = useState(defaultValue);

  const handleSelect = _selectedValue => {
    onSelect(_selectedValue);
    setSelectedValue(_selectedValue);
  };

  if(selectedValue) {
    return (
      <div className="flex">
        <span>{selectedValue.name}</span>
        <button className="bg-red-300 hover:bg-red-400 rounded p-1 mx-2" onClick={() => handleSelect(null)}>
          <MdClear />
        </button>
      </div>
    );
  }

  return (
    <AutocompleteSearchBar onSearch={api.artists.search} onSelect={handleSelect} name={name} className={className} />
  );
};