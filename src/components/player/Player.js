import React, { useContext } from 'react';
import ReactPlayer from 'react-player';

import { PlayerContext } from './PlayerProvider';

export const Player = () => {
  const { isPlaying, currentSongUrl } = useContext(PlayerContext);

  return (
    <div className="w-0 h-0">
      <ReactPlayer width={0} height={0}
        url={currentSongUrl}
        playing={isPlaying} />
    </div>
  );
};