import React, { useState, useEffect } from 'react';

import { AutocompleteSearchBar, RemoveButton } from '../common';
import { api } from '../../api';

export const GenreAutocompleteSelector = props => {
  const { onSelect, defaultValue, className, name, selectionsBelow } = props;

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

  const searchHandler = async searchTerm => (await api.genres.search(searchTerm))?.data;

  return (
    <div className="flex flex-col">
      <div className={`flex my-2 ${selectionsBelow ? 'order-last' : ''}`}>
        {
          selectedGenres.map(genre => (
            <div key={genre.id} className="flex">
              <span>{genre.name}</span>
              <RemoveButton className="mx-2"
                onClick={() => handleRemove(genre)}
                accessibleName={`Remove ${genre.name}`} />
            </div>
          ))
        }
      </div>
      <AutocompleteSearchBar removeOnSelect 
        onSearch={searchHandler} 
        onSelect={handleSelect} 
        name={name} 
        placeholder={selectedGenres.length ? "Add another genre" : "Add a genre"}
        className={className} />
    </div>
  );
};