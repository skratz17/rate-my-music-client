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

  const currentSongUrl = queue[playIndex]?.sources.find(source => source.isPrimary)?.url || queue[playIndex]?.sources[0]?.url;

  return (
    <PlayerContext.Provider value={{
      setQueue, play, pause, skip, isPlaying, currentSong, currentSongUrl
    }}>
      { props.children }
    </PlayerContext.Provider>
  );
};