import React, { useContext, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

import { PlayerContext } from './PlayerProvider';

export const Player = () => {
  const { isPlaying, currentSongUrl, skip, duration, handlePlaybackError, setDuration, setElapsed, setPlayerRef, setCanSeek } = useContext(PlayerContext);

  const playerRef = useRef(null);

  useEffect(() => {
    if(playerRef) {
      setPlayerRef(playerRef);
    }
  }, [ playerRef, setPlayerRef ]);

  const handleProgress = progress => {
    if(playerRef.current.getDuration() !== duration) {
      setDuration(playerRef.current.getDuration());
    }
    if(isPlaying) {
      setElapsed(progress.played);
      setCanSeek(true);
    }
  };

  return (
    <div className="w-0 h-0">
      <ReactPlayer width={0} height={0}
        ref={playerRef}
        onEnded={() => skip(1)}
        onDuration={duration => setDuration(duration)}
        onError={handlePlaybackError}
        onProgress={handleProgress}
        url={currentSongUrl}
        playing={isPlaying} />
    </div>
  );
};