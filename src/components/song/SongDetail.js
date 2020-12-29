import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { LinkButton, DeleteButton } from '../common';
import { PlayButton } from '../player/PlayButton';
import { GenreBadge } from '../genre/GenreBadge';

export const SongDetail = props => {
  const { song, canUserModify, onDelete } = props;

  const [ songSource, setSongSource ] = useState(song.sources.find(s => s.isPrimary)?.url);

  return (
    <div className="flex flex-col md:flex-row text-center md:text-left items-center md:items-start justify-between">
      <div className="flex flex-col">
        <h2 className="text-4xl text-deepred my-1">{song.name}</h2>
        <Link to={`/artists/${song.artist.id}`} className="text-2xl my-1 text-black hover:text-deepred">{song.artist.name}</Link>
        <span className="text-lg">Avg. Rating: {song.avgRating !== null ? song.avgRating : '--'} / 5</span>
        <span className="text-lg">Year: {song.year}</span>
        <div className="flex items-center">
          <span className="mr-1">Genres:</span>
          { song.genres.map(g => <GenreBadge key={g.genre.id}>{g.genre.name}</GenreBadge>) }
        </div>
      </div>
      <div className="flex flex-col items-end">
        { canUserModify && (
          <div className="flex">
            <LinkButton className="mr-2" to={`/songs/${song.id}/edit`}>edit</LinkButton>
            <DeleteButton onDelete={onDelete} accessibleName="Delete Song" />
          </div>
        )}
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
    </div>
  )
};