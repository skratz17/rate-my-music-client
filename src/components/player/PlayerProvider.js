import React, { createContext, useContext, useState, useEffect } from 'react';

import { UserContext } from '../user/UserProvider';

export const PlayerContext = createContext();

const createMinimalQueue = queue => {
  return queue.map(song => ({
    id: song.id,
    name: song.name,
    artist: {
      id: song.artist.id,
      name: song.artist.name
    },
    sources: [
      song.sources.find(source => source.isPrimary) || song.sources[0]
    ]
  }));
};

export const PlayerProvider = props => {
  const [ queue, setQueue ] = useState([]);
  const [ playIndex, setPlayIndex ] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(null);
  const [ duration, setDuration ] = useState(null);
  const [ elapsed, setElapsed ] = useState(null);
  const [ playerRef, setPlayerRef ] = useState(null);

  const { user } = useContext(UserContext);

  // on user state change, try to restore the queue for the user from local storage
  useEffect(() => {
    if(user) {
      const restoredQueue = localStorage.getItem(`${user.id}_playerState`);
      if(restoredQueue) {
        const parsedRestoredQueue = JSON.parse(restoredQueue);
        setIsPlaying(false);
        setQueue(parsedRestoredQueue.queue);
        setPlayIndex(parsedRestoredQueue.playIndex);
      }
    }
  }, [ user, setQueue, setPlayIndex ]);

  // on user and queue change, serialize the current minimal queue state to local storage
  useEffect(() => {
    if(user && queue?.length) {
      const toSerialize = {
        playIndex,
        queue: createMinimalQueue(queue)
      };

      localStorage.setItem(`${user.id}_playerState`, JSON.stringify(toSerialize));
    }
  }, [ user, playIndex, queue ]);

  const currentSong = queue[playIndex];

  const currentSongUrl = queue[playIndex]?.sources.find(source => source.isPrimary)?.url || queue[playIndex]?.sources[0]?.url;

  const play = (idx = playIndex) => {
    updatePlayIndex(idx);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const skip = increment => {
    updatePlayIndex(prevPlayIndex => {
      let nextIndex = prevPlayIndex + increment;
      if(nextIndex < 0) nextIndex = queue.length - 1;
      return nextIndex % queue.length;
    });
  };

  const updatePlayIndex = idx => {
    if(playIndex !== idx) {
      setDuration(null);
      setElapsed(null);
    }
    setPlayIndex(idx);
  };

  const updateQueue = songs => {
    if(!currentSong || songs[0]?.id !== currentSong.id) {
      setDuration(null);
      setElapsed(null);
    }
    setQueue(songs);
    setPlayIndex(0);
    setIsPlaying(true);
  };

  return (
    <PlayerContext.Provider value={{
      queue, updateQueue, play, pause, skip, setIsPlaying, isPlaying, currentSong, currentSongUrl,
      duration, setDuration, elapsed, setElapsed, playerRef, setPlayerRef
    }}>
      { props.children }
    </PlayerContext.Provider>
  );
};