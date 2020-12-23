import React from 'react';
import { Link } from 'react-router-dom';

import { PlayButton } from '../player/PlayButton';

export const ListDetail = props => {
  const { list } = props;

  return (
    <div className="flex-col">
      <div className="flex items-center mb-2">
        <div className="flex-col mr-2">
          <h2 className="text-emerald text-4xl">{list.name}</h2>
          <span className="text-xl">by <Link to={`/profiles/${list.creator.id}`} className="text-black hover:text-deepred">{list.creator.user.username}</Link></span>
        </div>
        <PlayButton className="text-5xl" 
          accessibleName={`Play all songs in list "${list.name}"`}
          songs={list.songs.map(s => s.song)} />
      </div>

      <p className="text-lg">{list.description}</p>
    </div>
  );
};
