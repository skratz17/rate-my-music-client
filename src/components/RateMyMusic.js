import React from 'react';
import { Route } from 'react-router-dom';

import { ApplicationViews } from './ApplicationViews';
import { WelcomeBanner } from './welcomeBanner/WelcomeBanner';
import { UnauthorizedUserViews } from './UnauthorizedUserViews';

export const RateMyMusic = () => {
  return (
    <Route render={() => {
      if(localStorage.getItem('rmm_user')) {
        return (
          <ApplicationViews />
        );
      }
      else {
        return (
          <>
            <WelcomeBanner />
            <UnauthorizedUserViews />
          </>
        );
      }
    }} />
  );
}
