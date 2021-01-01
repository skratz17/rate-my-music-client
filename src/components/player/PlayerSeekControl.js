import React, { useState, useContext, useEffect } from 'react';

import { PlayerContext } from './PlayerProvider';
import { Duration } from './Duration';

export const PlayerSeekControl = () => {
  const [ isSeeking, setIsSeeking ] = useState(false);
  const { elapsed, duration, playerRef } = useContext(PlayerContext);
  const [ seekLocation, setSeekLocation ] = useState(elapsed);

  useEffect(() => {
    if(!isSeeking) {
      setSeekLocation(elapsed);
    }
  }, [ elapsed ]);

  const stepSize = 1 / duration;

  const handleSeek = e => {
    const seekPercent = parseFloat(e.target.value);
    setSeekLocation(seekPercent);
  };

  const handleMouseUp = () => {
    setIsSeeking(false);
    playerRef.current.seekTo(seekLocation, 'fraction');
  };

  return (
    <div className="flex justify-center items-center">
      <Duration className="w-24 text-right" seconds={duration ? seekLocation * duration : 0} />
      <input type="range" min={0} max={1} step={!isNaN(stepSize) ? stepSize : ''}
        className="mx-2 flex-shrink-0"
        value={seekLocation || 0}
        onMouseDown={() => setIsSeeking(true)}
        onChange={handleSeek}
        onMouseUp={handleMouseUp} />
      <Duration className="w-24 text-left" seconds={duration} />
    </div>
  );
};