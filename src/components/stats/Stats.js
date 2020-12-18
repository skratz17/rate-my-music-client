import React from 'react';

import { api } from '../../api';
import { useApi } from '../../api/useApi';
import { WarningText } from '../common';

export const Stats = () => {
  const [ statsData, isLoading, error ] = useApi(api.stats.get);

  return (
    <div>
      <h2><span className="text-emerald font-bold">RMM</span> Stats</h2>
      <WarningText>{error}</WarningText>
      { isLoading && <p>loading...</p> }
      { statsData && 
        <ul>
          <li>{statsData.users} users</li>
          <li>{statsData.artists} artists</li>
          <li>{statsData.songs} songs</li>
          <li>{statsData.lists} lists</li>
        </ul>
      }
    </div>
  )
};