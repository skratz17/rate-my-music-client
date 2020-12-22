import React from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { WarningText, LoadingIndicator } from '../common';

export const Stats = () => {
  const [ statsData, isLoading, error ] = useApi(api.stats.get);

  return (
    <div>
      <h2 className="text-xl my-2"><span className="text-emerald">RMM</span> Stats</h2>
      <WarningText>{error}</WarningText>
      <LoadingIndicator isLoading={isLoading} />
      { statsData && 
        <ul className="text-lg">
          <li><span className="font-bold">{statsData.users}</span> users</li>
          <li><span className="font-bold">{statsData.artists}</span> artists</li>
          <li><span className="font-bold">{statsData.songs}</span> songs</li>
          <li><span className="font-bold">{statsData.lists}</span> lists</li>
        </ul>
      }
    </div>
  )
};