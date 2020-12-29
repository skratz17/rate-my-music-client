import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { LinkButton, DeleteButton } from '../common';
import { PlayButton } from '../player/PlayButton';

export const SongDetail = props => {
  const { song, canUserModify, onDelete } = props;

  const [ songSource, setSongSource ] = useState(song.sources.find(s => s.isPrimary)?.url);

  return (
    <div className="flex flex-col md:flex-row text-center md:text-left items-center md:items-start justify-between">
      <div className="flex flex-col items-center md:items-start">
        <h2 className="text-4xl text-deepred my-1">{song.name}</h2>
        <Link to={`/artists/${song.artist.id}`} className="text-2xl my-1 text-black hover:text-deepred">{song.artist.name}</Link>
        <span className="text-lg">Avg. Rating: {song.avgRating !== null ? song.avgRating : '--'} / 5</span>
        <span className="text-lg">
          Year: <Link className="text-black hover:text-emerald-dark" to={`/charts?startYear=${song.year}&endYear=${song.year}`}>{song.year}</Link>
        </span>
        <div className="flex items-center my-1">
          <span className="mr-1">Genres:</span>
          { song.genres.map(g => (
              <LinkButton key={g.genre.id}
                to={`/charts?genres=${g.genre.id}`} 
                className="mx-1 py-1 px-2 border border-gray-300 text-white hover:text-white bg-emerald hover:bg-emerald-dark rounded-xl">
                  {g.genre.name}
              </LinkButton>
            )) }
        </div>
      </div>
      <div className="flex flex-col items-center md:items-end order-first md:order-none">
        { canUserModify && (
          <div className="flex my-1">
            <LinkButton className="mr-2" to={`/songs/${song.id}/edit`}>edit</LinkButton>
            <DeleteButton onDelete={onDelete} accessibleName="Delete Song" />
          </div>
        )}
        <div className="flex items-center my-1">
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
  );
};