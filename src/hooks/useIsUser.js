import { useState, useContext, useEffect } from 'react';

import { UserContext } from '../components/user/UserProvider';

export const useIsUser = userId => {
  const [ isUser, setIsUser ] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    if(userId && user) {
      setIsUser(user.id === userId);
    }
  }, [ user, userId ]);

  return isUser;
};