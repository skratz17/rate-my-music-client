import React, { useContext } from 'react';
import { MdSkipPrevious, MdSkipNext, MdPlayArrow, MdPause } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { PlayerContext } from './PlayerProvider';
import { PlayerControl } from './PlayerControl';

export const PlayerControls = () => {
  const { play, pause, skip, isPlaying, currentSong } = useContext(PlayerContext);

  if(!currentSong) {
    return <p className="italic text-center">No songs have been queued.</p>
  }

  const playButton = (
    <PlayerControl onClick={play} accessibleName={`Play ${currentSong.name}`}>
      <MdPlayArrow />
    </PlayerControl>
  );

  const pauseButton = (
    <PlayerControl onClick={pause} accessibleName={`Pause ${currentSong.name}`}>
      <MdPause />
    </PlayerControl>
  );

  return (
    <div className="max-w-screen-lg mx-auto flex flex-col items-center justify-center text-center">
      <div className="mb-1">
        <h3 className="text-xl">
          <Link className="text-black hover:text-deepred" to={`/songs/${currentSong.id}`}>{currentSong.name}</Link>
        </h3>
        <h4>
          <Link className="text-black hover:text-deepred" to={`/artists/${currentSong.artist.id}`}>{currentSong.artist.name}</Link>
        </h4>
      </div>

      <div className="flex justify-evenly">
        <PlayerControl onClick={() => skip(-1)} accessibleName="Previous Song">
          <MdSkipPrevious />
        </PlayerControl>

        { isPlaying ? pauseButton : playButton }

        <PlayerControl onClick={() => skip(1)} accessibleName="Next Song">
          <MdSkipNext />
        </PlayerControl>
      </div>
    </div>
  );
};