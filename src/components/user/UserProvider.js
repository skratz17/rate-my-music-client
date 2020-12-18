import React, { createContext, useState, useEffect } from 'react';

import { api } from '../../api';

export const UserContext = createContext();

export const UserProvider = props => {
  const [ token, setToken ] = useState(localStorage.getItem('rmm_user'));
  const [ user, setUser ] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const userData = await api.user.getCurrentData();
      setUser(userData);
    };

    if(token) {
      getUserData();
    }
    else {
      setUser(null);
    }
  }, [ token ]);

  const isLoggedIn = () => token !== null;

  const setUserToken = token => {
    localStorage.setItem('rmm_user', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('rmm_user');
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, setUserToken, logout, user, token }}>
      {props.children}
    </UserContext.Provider>
  )
};