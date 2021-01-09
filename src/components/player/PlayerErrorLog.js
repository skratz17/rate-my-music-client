import React, { useContext } from 'react';

import { PlayerContext } from './PlayerProvider';

export const PlayerErrorLog = () => {
  const { errorQueue } = useContext(PlayerContext);

  if(!errorQueue.length) return null;

  return (
    <ul className="flex flex-col items-end">
      {
        errorQueue.map(e => (
          <li key={e} className="p-4 my-4 rounded bg-black bg-opacity-80 text-white w-1/4">{e}</li>
        ))
      }
    </ul>
  );
};