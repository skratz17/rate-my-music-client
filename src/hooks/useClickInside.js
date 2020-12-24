import { useEffect } from 'react';

export const useClickInside = (ref, handler) => {
  useEffect(() => {
    const listener = e => {
      if(!ref.current || ref.current.contains(e.target)) {
        handler(e);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ ref, handler ]);
};