import React from 'react';

import styles from './WelcomePage.module.css';

export const WelcomePage = props => {
  return (
    <div className={`h-screen w-screen overflow-hidden bg-right xl:bg-center bg-no-repeat bg-cover p-3 ${styles.welcomePage}`}>
      <h1 className="text-emerald font-bold text-center text-7xl">rate my music</h1>
      <div className="h-full flex lg:justify-around lg:items-center items-start justify-center lg:pb-36">
        {props.children}
        <div className="hidden lg:block" />
      </div>
    </div>
  );
};