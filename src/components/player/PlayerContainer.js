import React, { useEffect, useState, useContext, useCallback } from 'react';
import { MdExpandLess, MdQueueMusic } from 'react-icons/md';

import { PlayerControls } from './PlayerControls';
import { PlayerContext } from './PlayerProvider';
import { Player } from './Player';
import { Queue } from './Queue';
import { RemoveButton } from '../common';
import { useDebounce } from '../../hooks';

export const PlayerContainer = () => {
  const [ isExpanded, setIsExpanded ] = useState(false);
  const [ isQueueShowing, setIsQueueShowing ] = useState(false);

  const debouncedIsQueueShowing = useDebounce(isQueueShowing, 150);

  const { isPlaying, queue } = useContext(PlayerContext);

  useEffect(() => {
    if(isExpanded) document.body.style = 'margin-bottom: 10rem;';
    else document.body.style = 'margin-bottom: 5rem;';

    return () => document.body.style = 'margin-bottom: 0';
  }, [ isExpanded ]);

  useEffect(() => {
    if(isPlaying && queue) setIsExpanded(true);
  }, [ isPlaying, queue ]);

  const handleEscape = useCallback(e => {
    if(e.key === 'Escape') {
      setIsQueueShowing(false);  
    }
  }, [ setIsQueueShowing ]);

  useEffect(() => {
    if(isQueueShowing) {
      document.addEventListener('keydown', handleEscape);

      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [ isQueueShowing ]);

  return <>
    <div style={{ height: isExpanded ? '10rem' : '5rem' }}
      className={`w-full fixed z-10 bottom-0 bg-gray-100 px-2 py-4 border-t border-gray-200 transition-all flex flex-col ${isExpanded ? 'justify-between' : 'justify-center'}`}
    >
      <div className="flex items-center justify-between relative">
        <button onClick={() => setIsQueueShowing(prevIsQueueShowing => !prevIsQueueShowing)}
          className={`text-3xl hover:bg-gray-200 mr-auto ${isQueueShowing ? 'text-deepred' : 'text-black'}`}>
            <span className="sr-only">{isQueueShowing ? 'Hide Queue' : 'Show Queue'}</span>
            <MdQueueMusic />
        </button>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <button className="absolute top-0 left-0 w-full h-full" onClick={() => setIsExpanded(prevExpanded => !prevExpanded)}>
            <span className="sr-only">{isExpanded ? "Collapse Player" : "Expand Player" }</span>
          </button>
          <h2 className="text-2xl text-center"><span className="text-emerald">RMM</span> Player</h2>
        </div>

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

    <div style={{ height: `calc(100vh - ${isExpanded ? '10rem' : '5rem' })`}} 
      className={`fixed top-0 left-0 overflow-scroll bg-lightyellow bg-opacity-80 transform transition-all w-56 px-2 py-4 ${isQueueShowing ? 'translate-x-0' : '-translate-x-full'}`}>
        { (isQueueShowing || debouncedIsQueueShowing) && <>
          <RemoveButton className="ml-auto" accessibleName="Hide Queue" onClick={() => setIsQueueShowing(false)} />
          <Queue />
        </> }
    </div>
  </>;
};