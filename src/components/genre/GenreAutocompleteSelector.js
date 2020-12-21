import React, { useState } from 'react';
import { MdClear } from 'react-icons/md';

import { AutocompleteSearchBar } from '../common';
import { api } from '../../api';

export const GenreAutocompleteSelector = props => {
  const { onSelect, defaultValue, className, name } = props;

  const [ selectedGenres, setSelectedGenres ] = useState(defaultValue || []);

  const handleSelect = _selectedValue => {
    if(!selectedGenres.some(genre => genre.id === _selectedValue.id)) {
      setSelectedGenres(prevSelectedGenres => {
        const updatedGenres = [ ...prevSelectedGenres, _selectedValue ]
        onSelect(updatedGenres);
        return updatedGenres;
      });
    }
  };

  const handleRemove = genreToRemove => {
    setSelectedGenres(prevSelectedGenres => {
      const updatedGenres = prevSelectedGenres.filter(genre => genre.id !== genreToRemove.id)
      onSelect(updatedGenres);
      return updatedGenres;
    });
  };

  return (
    <div>
      <AutocompleteSearchBar removeOnSelect onSearch={api.genres.search} onSelect={handleSelect} name={name} className={className} />
      <div className="flex">
        {
          selectedGenres.map(genre => (
            <div key={genre.id} className="flex">
              <span>{genre.name}</span>
              <button className="bg-red-300 hover:bg-red-400 rounded p-1 mx-2" onClick={() => handleRemove(genre)}>
                <MdClear />
                <span className="sr-only">Remove {genre.name}</span>
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
};