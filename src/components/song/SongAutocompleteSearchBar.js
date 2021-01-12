import React, { useState } from 'react';

import { AutocompleteSearchBar, RemoveButton } from '../common';
import { api } from '../../api';

export const SongAutocompleteSearchBar = props => {
  const { onSelect, defaultValue, className, name } = props;

  const [ selectedValue, setSelectedValue ] = useState(defaultValue);

  const handleSelect = _selectedValue => {
    onSelect(_selectedValue);
    setSelectedValue(_selectedValue);
  };

  if(selectedValue) {
    return (
      <div className="flex my-2">
        <span>{selectedValue.name}</span>
        <RemoveButton className="mx-2"
          onClick={() => handleSelect(null)}
          accessibleName="Clear Song" />
      </div>
    );
  }

  const nameFormatter = song => `${song.name} - ${song.artist.name}`;

  const searchHandler = async searchParams => await api.songs.list(searchParams);

  return (
    <AutocompleteSearchBar name={name} 
      onSearch={searchHandler} 
      onSelect={handleSelect} 
      resultFormatter={nameFormatter}
      className={className} />
  );
};