import React, { useContext } from 'react';

import { PlayerContext } from './PlayerProvider';

export const Queue = () => {
  const { queue, play, currentSong } = useContext(PlayerContext);

  if(!queue?.length) {
    return <p className="italic">You have no songs queued.</p>;
  }

  return (
    <div>
      <h3 className="text-2xl text-center">Your Queue</h3>
      <ul>
        { queue.map((song, idx) => (
          <li key={song.id}
            className={`relative flex flex-col items-center justify-center text-center my-2 rounded hover:bg-lightyellow-dark ${song.id === currentSong.id ? 'text-deepred-dark font-bold animate-pulse' : ''}`}>
            <button className="absolute top-0 left-0 w-full h-full" onClick={() => play(idx)}>
              <span className="sr-only">Play Song in Queue</span>
            </button>
            <span className="text-lg">{song.name}</span>
            <span>{song.artist.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
};