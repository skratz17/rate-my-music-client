import React from 'react';
import { MdPerson, MdMusicNote, MdList } from 'react-icons/md';

import { Page, LinkButton } from '../common';
import { Stats } from '../stats/Stats';

export const ContributePage = () => {

  return (
    <Page className="text-center">
      <p className="text-xl">Contribute to <span className="text-emerald">RateMyMusic</span> by creating a new <span className="text-deepred">Artist</span>, adding a new <span className="text-deepred">Song</span> to the database, or making a <span className="text-deepred">List</span> of some of your favorite songs!</p>

      <div className="flex flex-col sm:flex-row justify-evenly max-w-screen-md mx-auto my-8">
        <LinkButton to="/artists/new" className="flex flex-col justify-center items-center p-5 mx-0 my-2 sm:mx-2">
          <MdPerson className="text-6xl" />
          Create a New Artist
        </LinkButton>

        <LinkButton to="/songs/new" className="flex flex-col justify-center items-center p-5 mx-0 my-2 sm:mx-2">
          <MdMusicNote className="text-6xl" />
          Create a New Song
        </LinkButton>

        <LinkButton to="/lists/new" className="flex flex-col justify-center items-center p-5 mx-0 my-2 sm:mx-2">
          <MdList className="text-6xl" />
          Create a New List 
        </LinkButton>
      </div>

      <Stats />
    </Page>
  );
};