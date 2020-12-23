import React from 'react';
import { Link } from 'react-router-dom';

export const ListSongList = props => {
  const { listSongs } = props;

  if(!listSongs.length) {
    return <p className="italic">There are no songs to display.</p>
  }

  return (
    <ul>
      { listSongs.map(listSong  => (
        <li key={listSong.song.id} className="flex flex-col my-4">
          <h3 className="text-3xl">
            <Link to={`/songs/${listSong.song.id}`} className="text-deepred hover:text-deepred-dark">{listSong.song.name}</Link>
          </h3>
          <Link to={`/artists/${listSong.song.artist.id}`} className="text-xl text-black hover:text-deepred">{listSong.song.artist.name}</Link>
          <p className="text-lg">{listSong.description}</p>
        </li>    
      ))}
    </ul>
  );
};