import React, { useContext, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

import { PlayerContext } from './PlayerProvider';

export const Player = () => {
  const { setIsPlaying, isPlaying, currentSongUrl, skip, setDuration, setElapsed, setPlayerRef } = useContext(PlayerContext);

  const playerRef = useRef(null);

  useEffect(() => {
    if(playerRef) {
      setPlayerRef(playerRef);
    }
  }, [ playerRef, setPlayerRef ]);

  return (
    <div className="w-0 h-0">
      <ReactPlayer width={0} height={0}
        ref={playerRef}
        onEnded={() => skip(1)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onDuration={duration => setDuration(duration)}
        onProgress={progress => setElapsed(progress.played)}
        url={currentSongUrl}
        playing={isPlaying} />
    </div>
  );
};