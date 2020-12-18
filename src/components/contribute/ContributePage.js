import React from 'react';
import { MdPerson, MdMusicNote } from 'react-icons/md';

import { LinkButton } from '../common';
import { Stats } from '../stats/Stats';

export const ContributePage = () => {

  return (
    <div className="max-w-screen-lg mx-auto text-center">
      <p className="text-xl">Contribute to <span className="text-emerald">RateMyMusic</span> by creating a new <span className="text-deepred">Artist</span> or adding a new <span className="text-deepred">Song</span> to the database!</p>

      <div className="flex flex-col sm:flex-row justify-evenly items-center max-w-screen-md mx-auto my-8">
        <LinkButton to="/artists/new" className="flex flex-col justify-center items-center p-5 mx-0 my-2 sm:mx-2">
          <MdPerson className="text-6xl" />
          Create a New Artist
        </LinkButton>

        <p className="mx-0 my-2 sm:mx-2">OR</p>

        <LinkButton to="/songs/new" className="flex flex-col justify-center items-center p-5 mx-0 my-2 sm:mx-2">
          <MdMusicNote className="text-6xl" />
          Create a New Song
        </LinkButton>
      </div>

      <Stats />
    </div>
  );
};