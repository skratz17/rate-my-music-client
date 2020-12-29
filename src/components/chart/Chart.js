import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { api } from '../../api';
import { usePagination, useApi } from '../../hooks';
import { queryParamsToString } from '../../utils';
import { YearSelect } from './YearSelect';
import { SongList } from '../song/SongList';
import { PlayButton } from '../player/PlayButton';
import { GenreAutocompleteSelector } from '../genre/GenreAutocompleteSelector';
import { Page, LoadingIndicator, WarningText, PaginationControls } from '../common';

const createInitialChartParams = location => {
  const initialState = { orderBy: 'avgRating', direction: 'desc' };
  const params = new URLSearchParams(location.search);

  if(params.has('startYear')) initialState.startYear = params.get('startYear');
  if(params.has('endYear')) initialState.endYear = params.get('endYear');
  if(params.has('genres')) initialState.genres = params.get('genres').split(',').map(val => parseInt(val, 10));

  return initialState;
};

export const Chart = () => {
  const location = useLocation();
  const history = useHistory();

  const initialChartParams = createInitialChartParams(location);

  const [ chartParams, setChartParams ] = useState(initialChartParams);
  const [ paginationParams, paginationFunctions ] = usePagination();
  const [ songsResponse, isLoading, error ] = useApi(api.songs.list, { ...chartParams, ...paginationParams });
  const [ initiallySelectedGenres, setInitiallySelectedGenres ] = useState(null);

  useEffect(() => {
    const setInitiallySelectedGenresFromApi = async () => {
      const allGenres = await api.genres.list();
      setInitiallySelectedGenres(allGenres.data.filter(g => initialChartParams.genres.includes(g.id)));
    };

    if(initialChartParams.genres) {
      setInitiallySelectedGenresFromApi();
    }
    else {
      setInitiallySelectedGenres([]);
    }
  }, []);

  useEffect(() => {
    const urlParams = {};
    const { startYear, endYear, genres } = chartParams;

    if(startYear) urlParams.startYear = startYear;
    if(endYear) urlParams.endYear = endYear;
    if(genres) urlParams.genres = genres;

    const queryStringParams = queryParamsToString(urlParams);
    const queryString = queryStringParams ? `?${queryStringParams}` : '';

    if(queryString !== location.search) {
      history.push(`/charts${queryString}`);
    }
  }, [ chartParams ]);

  const songs = songsResponse?.data;
  const count = songsResponse?.count;

  const handleChange = e => {
    const { name, value } = e.target;
    setChartParams(prevChartParams => {
      const updatedChartParams = { ...prevChartParams };
      if(value === '') delete updatedChartParams[name];
      else updatedChartParams[name] = value;
      return updatedChartParams;
    });
    paginationFunctions.getPage(1);
  };

  const handleGenreSelect = genres => {
    const genreIds = genres.map(g => g.id);
    setChartParams(prevChartParams => {
      const updatedChartParams = { ...prevChartParams };
      if(!genreIds.length) delete updatedChartParams.genres;
      else updatedChartParams.genres = genreIds;
      return updatedChartParams;
    });
    paginationFunctions.getPage(1);
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
            { initiallySelectedGenres && 
              <GenreAutocompleteSelector selectionsBelow 
                className="p-2" 
                name="genres" 
                defaultValue={initiallySelectedGenres}
                onSelect={handleGenreSelect} />
            }
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
        { songs && 
          <div>
            <SongList songs={songs} /> 
            <PaginationControls page={paginationParams.page}
              pageSize={paginationParams.pageSize}
              isLastPage={paginationFunctions.isLastPage(count)}
              onSetPageSize={paginationFunctions.setPageSize}
              onPreviousPage={paginationFunctions.getPreviousPage}
              onNextPage={paginationFunctions.getNextPage} />
          </div>
        }
      </section>
    </Page>
  );
};