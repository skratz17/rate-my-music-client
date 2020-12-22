import React, { createContext, useState, useEffect } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = props => {
  const [ queue, setQueue ] = useState([]);
  const [ playIndex, setPlayIndex ] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false);

  useEffect(() => {
    if(queue.length) {
      setIsPlaying(true);
    }
  }, [ queue ]);

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const skip = increment => {
    setPlayIndex(prevPlayIndex => (prevPlayIndex + increment) % queue.length);
  };

  const currentSong = queue[playIndex];

  return (
    <PlayerContext.Provider value={{
      setQueue, currentSong, play, pause, skip, isPlaying
    }}>
      { props.children }
    </PlayerContext.Provider>
  );
};