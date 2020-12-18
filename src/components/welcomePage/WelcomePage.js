import React from 'react';

import styles from './WelcomePage.module.css';

export const WelcomePage = props => {
  return (
    <div className={`h-screen w-screen bg-right xl:bg-center bg-no-repeat bg-cover ${styles.welcomePage}`}>
      {props.children}
    </div>
  );
};