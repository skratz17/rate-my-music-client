import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Home } from './home/Home';
import { ContributePage } from './contribute/ContributePage';
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