import React, { useState } from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { YearSelect } from './YearSelect';
import { SongList } from '../song/SongList';
import { PlayButton } from '../player/PlayButton';
import { GenreAutocompleteSelector } from '../genre/GenreAutocompleteSelector';

export const Chart = () => {
  const [ chartParams, setChartParams ] = useState({ orderBy: 'avgRating', direction: 'desc' });
  const [ songs, isLoading, error ] = useApi(api.songs.list, chartParams);

  const handleChange = e => {
    setChartParams(prevChartParams => ({
      ...prevChartParams,
      [e.target.name]: e.target.value
    }));
  };

  const handleGenreSelect = genres => {
    const genreIds = genres.map(g => g.id);
    setChartParams(prevChartParams => {
      const updatedChartParams = { ...prevChartParams };
      if(!genreIds.length) delete updatedChartParams.genres;
      else updatedChartParams.genres = genreIds;
      return updatedChartParams;
    });
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <section>
        <h2 className="text-3xl text-center">The <span className="text-emerald">Charts</span></h2>
        <div>
          Best songs from between <YearSelect name="startYear" value={chartParams.startYear || ''} onChange={handleChange} /> 
          and <YearSelect name="endYear" value={chartParams.endYear || ''} onChange={handleChange} />
        </div>
        <div>
          In the genres: <GenreAutocompleteSelector className="p-2" name="genres" onSelect={handleGenreSelect} />
        </div>
      </section>

      <section>
        { songs && <SongList songs={songs} /> }
      </section>
    </div>
  );
};