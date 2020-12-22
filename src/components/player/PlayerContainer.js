import React, { useEffect, useState, useContext } from 'react';
import { MdExpandLess } from 'react-icons/md';

import { PlayerControls } from './PlayerControls';
import { PlayerContext } from './PlayerProvider';
import { Player } from './Player';

export const PlayerContainer = () => {
  const [ isExpanded, setIsExpanded ] = useState(false);

  const { isPlaying } = useContext(PlayerContext);

  useEffect(() => {
    if(isExpanded) document.body.style = 'margin-bottom: 10rem;';
    else document.body.style = 'margin-bottom: 5rem;';
  }, [ isExpanded ]);

  useEffect(() => {
    if(isPlaying) setIsExpanded(true);
  }, [ isPlaying ]);

  return (
    <div style={{ height: isExpanded ? '10rem' : '5rem' }}
      className={`w-full fixed z-10 bottom-0 bg-gray-100 px-2 py-4 border-t border-gray-200 transition-all flex flex-col ${isExpanded ? 'justify-between' : 'justify-center'}`}
    >
      <div className="flex items-center justify-between relative">
        <h2 className="text-2xl text-center absolute left-1/2 transform -translate-x-1/2"><span className="text-emerald">RMM</span> Player</h2>
        <button onClick={() => setIsExpanded(prevExpanded => !prevExpanded)} 
          className="text-3xl hover:bg-gray-200 ml-auto"
        >
          <MdExpandLess style={{ transition: 'transform 300ms ease-in-out' }} className={`transform ${isExpanded ? 'rotate-180' : ''}`}/>
          <span className="sr-only">{isExpanded ? "Collapse Player" : "Expand Player" }</span>
        </button>
      </div>
      { isExpanded && <PlayerControls /> }
      <Player />
    </div>
  );
};