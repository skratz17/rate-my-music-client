import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { PlayButton } from '../player/PlayButton';

export const SongDetail = props => {
  const { song } = props;

  const [ songSource, setSongSource ] = useState(song.sources.find(s => s.isPrimary)?.url);

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col">
        <h2 className="text-4xl text-deepred my-1">{song.name}</h2>
        <Link to={`/artists/${song.artist.id}`} className="text-2xl my-1 text-black hover:text-deepred">{song.artist.name}</Link>
        <span className="text-lg">Avg. Rating: {song.avgRating !== null ? song.avgRating : '--'} / 5</span>
        <span className="text-lg">Year: {song.year}</span>
      </div>
      <div className="flex items-center">
        <PlayButton className="text-5xl mx-2" 
          accessibleName={`Play ${song.name}`}
          songs={[ songSource ? { ...song, sources: song.sources.filter(s => s.url === songSource) } : song ]} />
        <select className="p-2" value={songSource} onChange={e => setSongSource(e.target.value)}>
          <option value="" disabled>Select a source to play...</option>
          { song.sources.map(s => <option key={s.url} value={s.url}>{s.service}</option>) }
        </select>
      </div>
    </div>
  )
};