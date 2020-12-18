import { useContext, useEffect } from 'react';

import { UserContext } from '../user/UserProvider';

export const Logout = () => {
  const { isLoggedIn, logout } = useContext(UserContext);

  useEffect(() => {
    if(isLoggedIn()) {
      logout();
    }
  }, []);

  return null;
}