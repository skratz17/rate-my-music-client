import { useState, useEffect } from 'react';

export const useDebounce = (watchedVar, duration = 500) => {
  const [ debouncedValue, setDebouncedValue ] = useState(watchedVar);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(watchedVar), duration);

    return () => clearTimeout(timeoutId);
  }, [ watchedVar ]);

  return debouncedValue;
};