import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { UserContext } from '../user/UserProvider';

export const Logout = () => {
  const { isLoggedIn, logout } = useContext(UserContext);

  useEffect(() => {
    if(isLoggedIn()) {
      logout();
    }
  }, []);

  return (
    !isLoggedIn() && <Redirect to="/" />
  );
}