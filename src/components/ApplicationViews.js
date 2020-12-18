import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Home } from './home/Home';

export const ApplicationViews = () => {
  return (
    <Switch>
      <Route path="/logout" render={() => {
        localStorage.removeItem('rmm_user');
        return <Redirect to="/" />;
      }} />

      <Route path="/home">
        <Home />
      </Route>

      <Route path="/" >
        <Redirect to="/home" />
      </Route>
    </Switch>
  );
};