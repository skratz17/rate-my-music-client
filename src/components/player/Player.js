import React, { useContext } from 'react';
import ReactPlayer from 'react-player';

import { PlayerContext } from './PlayerProvider';

export const Player = () => {
  const { setIsPlaying, isPlaying, currentSongUrl, skip } = useContext(PlayerContext);

  return (
    <div className="w-0 h-0">
      <ReactPlayer width={0} height={0}
        onEnded={() => skip(1)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        url={currentSongUrl}
        playing={isPlaying} />
    </div>
  );
};