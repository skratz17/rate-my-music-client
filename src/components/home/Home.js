import React from 'react';
import { ArtistAutocompleteSearchBar } from '../artist/ArtistAutocompleteSearchBar';
import { api } from '../../api';

export const Home = () => {
  const handleSearch = async searchTerm => {
    if(searchTerm) {
      return await api.artists.list({ q: searchTerm });
    }
  }

  const handleSelect = option => {
    console.log(option);
  }

  return (
    <div className="px-5">
      <ArtistAutocompleteSearchBar onSelect={() => {}} />
    </div>
  )
};