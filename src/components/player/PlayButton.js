import React, { useContext } from 'react';
import { MdPlayCircleFilled } from 'react-icons/md';

import { PlayerContext } from './PlayerProvider';

export const PlayButton = props => {
  const { songs, className, accessibleName } = props;
  const { setQueue } = useContext(PlayerContext);

  return (
    <button onClick={() => setQueue([ ...songs ])}
      className={`bg-transparent hover:text-deepred ${className || ''}`}>
        <MdPlayCircleFilled />
        <span className="sr-only">{accessibleName || "Play Songs"}</span>
    </button>
  );
};