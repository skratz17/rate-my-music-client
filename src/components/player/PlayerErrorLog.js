import React, { useContext } from 'react';

import { PlayerContext } from './PlayerProvider';

export const PlayerErrorLog = () => {
  const { errorQueue, removeErrorMessage } = useContext(PlayerContext);

  if(!errorQueue.length) return null;

  return (
    <ul className="flex flex-col items-end">
      {
        errorQueue.map((errorMessage, idx) => (
          <li key={errorMessage} className="p-4 my-4 rounded bg-black hover:bg-gray-800 hover:bg-opacity-80 bg-opacity-80 text-white relative">
            <button className="absolute top-0 left-0 w-full h-full" onClick={() => removeErrorMessage(idx)}>
              <span className="sr-only">Remove Error Message</span>
            </button>
            {errorMessage}
          </li>
        ))
      }
    </ul>
  );
};