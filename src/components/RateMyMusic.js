import React from 'react';
import { Route } from 'react-router-dom';

import { NavBar } from './nav/NavBar';
import { ApplicationViews } from './ApplicationViews';
import { WelcomePage } from './welcomePage/WelcomePage';
import { UnauthorizedUserViews } from './UnauthorizedUserViews';

export const RateMyMusic = () => {
  return (
    <Route render={() => {
      if(localStorage.getItem('rmm_user')) {
        return (
          <>
            <NavBar />
            <ApplicationViews />
          </>
        );
      }
      else {
        return (
          <WelcomePage>
            <UnauthorizedUserViews />
          </WelcomePage>
        );
      }
    }} />
  );
}
