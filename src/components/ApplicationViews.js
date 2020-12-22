import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Home } from './home/Home';
import { ContributePage } from './contribute/ContributePage';
import { ArtistForm } from './artist/ArtistForm';
import { ArtistEditForm } from './artist/ArtistEditForm';
import { SongForm } from './song/SongForm';
import { SongEditForm } from './song/SongEditForm';
import { Logout } from './auth/Logout';

export const ApplicationViews = () => {
  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>

      <Route path="/charts">
        <div>charts</div>
      </Route>

      <Route path="/lists">
        <div>lists</div>
      </Route>

      <Route path="/contribute">
        <ContributePage />
      </Route>

      <Route path="/artists/:artistId(\d+)/edit" render={props => {
        const { artistId } = props.match.params;
        return <ArtistEditForm artistId={artistId} />;
      }} />

      <Route path="/artists/new">
        <ArtistForm />
      </Route>

      <Route path="/songs/:songId(\d+)/edit" render={props => {
        const { songId } = props.match.params;
        return <SongEditForm songId={songId} />;
      }} />

      <Route path="/songs/new">
        <SongForm />
      </Route>

      <Route path="/me">
        <div>me</div>
      </Route>

      <Route path="/logout">
        <Logout />
      </Route>

      <Route path="/" >
        <Redirect to="/home" />
      </Route>
    </Switch>
  );
};