import React, { useContext } from 'react';
import { Route } from 'react-router-dom';

import { UserContext } from './user/UserProvider';
import { NavBar } from './nav/NavBar';
import { ApplicationViews } from './ApplicationViews';
import { WelcomePage } from './welcomePage/WelcomePage';
import { UnauthorizedUserViews } from './UnauthorizedUserViews';
import { PlayerExpander } from './player/PlayerExpander';

export const RateMyMusic = () => {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <Route render={() => {
      if(isLoggedIn()) {
        return (
          <>
            <NavBar />
            <main className="p-5">
              <ApplicationViews />
            </main>
            <footer>
              <PlayerExpander />
            </footer>
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
