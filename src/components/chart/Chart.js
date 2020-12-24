import React, { useState } from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { YearSelect } from './YearSelect';
import { SongList } from '../song/SongList';
import { PlayButton } from '../player/PlayButton';
import { GenreAutocompleteSelector } from '../genre/GenreAutocompleteSelector';
import { Page, LoadingIndicator, WarningText } from '../common';

export const Chart = () => {
  const [ chartParams, setChartParams ] = useState({ orderBy: 'avgRating', direction: 'desc' });
  const [ songs, isLoading, error ] = useApi(api.songs.list, chartParams);

  const handleChange = e => {
    const { name, value } = e.target;
    setChartParams(prevChartParams => {
      const updatedChartParams = { ...prevChartParams };
      if(value === '') delete updatedChartParams[name];
      else updatedChartParams[name] = value;
      return updatedChartParams;
    });
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
    <Page>
      <h2 className="text-3xl text-center">The <span className="text-emerald">Charts</span></h2>
      <section>
        <LoadingIndicator isLoading={!songs && isLoading} />
        <WarningText>{error}</WarningText>
        <div className="text-xl my-2">
          <label htmlFor="startYear">Best songs from between </label>
          <YearSelect name="startYear" value={chartParams.startYear || ''} onChange={handleChange} /> 
          <label htmlFor="endYear"> and </label>
          <YearSelect name="endYear" value={chartParams.endYear || ''} onChange={handleChange} />
        </div>
        <div className="flex w-100 my-2">
          <label className="mt-1 mr-2 text-xl" htmlFor="genres">In the genres:</label>
          <div className="flex-grow">
            <GenreAutocompleteSelector selectionsBelow className="p-2" name="genres" onSelect={handleGenreSelect} />
          </div>
        </div>
      </section>

      <section>
        { songs?.length > 0 && 
          <div className="flex items-center">
            <span className="text-3xl mr-2">Play All</span>
            <PlayButton className="text-5xl" songs={songs} accessibleName="Play All Songs in Chart" />
          </div>
        }
        { songs && <SongList songs={songs} /> }
      </section>
    </Page>
  );
};