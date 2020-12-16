import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Login } from './auth/Login';
import { Register } from './auth/Register';

export const UnauthorizedUserViews = () => {
  return (
    <>
      <Route exact path="/" render={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </>
  )
};