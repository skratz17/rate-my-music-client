import React, { useState, useEffect } from 'react';
import { MdClear } from 'react-icons/md';

import { AutocompleteSearchBar } from '../common';
import { api } from '../../api';

export const GenreAutocompleteSelector = props => {
  const { onSelect, defaultValue, className, name } = props;

  const [ selectedGenres, setSelectedGenres ] = useState(defaultValue || []);

  useEffect(() => {
    onSelect(selectedGenres);
  }, [ selectedGenres ]);

  const handleSelect = _selectedValue => {
    if(!selectedGenres.some(genre => genre.id === _selectedValue.id)) {
      setSelectedGenres(prevSelectedGenres => {
        const updatedGenres = [ ...prevSelectedGenres, _selectedValue ]
        return updatedGenres;
      });
    }
  };

  const handleRemove = genreToRemove => {
    setSelectedGenres(prevSelectedGenres => {
      const updatedGenres = prevSelectedGenres.filter(genre => genre.id !== genreToRemove.id)
      return updatedGenres;
    });
  };

  return (
    <div>
      <div className="flex my-2">
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
      <AutocompleteSearchBar removeOnSelect 
        onSearch={api.genres.search} 
        onSelect={handleSelect} 
        name={name} 
        placeholder={selectedGenres.length ? "Add another genre" : "Add a genre"}
        className={className} />
    </div>
  );
};