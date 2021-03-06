import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { UserContext } from './user/UserProvider';
import { Home } from './home/Home';
import { Chart } from './chart/Chart';
import { ContributePage } from './contribute/ContributePage';
import { ArtistForm } from './artist/ArtistForm';
import { ArtistEditForm } from './artist/ArtistEditForm';
import { ArtistPage } from './artist/ArtistPage';
import { SongForm } from './song/SongForm';
import { SongEditForm } from './song/SongEditForm';
import { SongPage } from './song/SongPage';
import { ListForm } from './list/ListForm';
import { ListEditForm } from './list/ListEditForm';
import { ListPage } from './list/ListPage';
import { ListListPage } from './list/ListListPage';
import { ProfilePage } from './profile/ProfilePage';
import { Logout } from './auth/Logout';

export const ApplicationViews = () => {
  const { user } = useContext(UserContext);

  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>

      <Route path="/charts">
        <Chart />
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

      <Route path="/artists/:artistId(\d+)" render={props => {
        const { artistId } = props.match.params;
        return <ArtistPage artistId={artistId} />;
      }} />

      <Route path="/songs/:songId(\d+)/edit" render={props => {
        const { songId } = props.match.params;
        return <SongEditForm songId={songId} />;
      }} />

      <Route path="/songs/new">
        <SongForm />
      </Route>

      <Route path="/songs/:songId(\d+)" render={props => {
        const { songId } = props.match.params;
        return <SongPage songId={songId} />;
      }} />

      <Route path="/lists/:listId(\d+)/edit" render={props => {
        const { listId } = props.match.params;
        return <ListEditForm listId={listId} />;
      }} />

      <Route path="/lists/new">
        <ListForm />
      </Route>

      <Route path="/lists/:listId(\d+)" render={props => {
        const { listId } = props.match.params;
        return <ListPage listId={listId} />;
      }} />

      <Route path="/lists">
        <ListListPage />
      </Route>

      <Route path="/profiles/:userId(\d+)" render={props => {
        const { userId } = props.match.params;
        return <ProfilePage userId={userId} />
      }} />

      <Route path="/me">
        { user && <ProfilePage userId={user.id} /> }
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