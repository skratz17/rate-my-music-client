import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { Login } from './auth/Login';
import { Register } from './auth/Register';

export const UnauthorizedUserViews = () => {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>

      <Route path="/register">
        <Register />
      </Route>

      <Route path="/">
        <Redirect to="/login" />
      </Route>
    </Switch>
  )
};