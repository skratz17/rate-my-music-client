import React from 'react';

import { convertSecondsToTimeString } from '../../utils';

export const Duration = props => {
  const { seconds, className } = props;

  return (
    <span className={className}>
      { seconds !== null && !isNaN(seconds) ? convertSecondsToTimeString(Math.floor(seconds)) : '--' }
    </span>
  );
};