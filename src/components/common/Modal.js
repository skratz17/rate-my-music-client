import React, { useEffect, useRef, useCallback } from 'react';

import { useClickOutside, useDebounce } from '../../hooks';

export const Modal = props => {
  const { isShowing, onClose } = props;

  const modalRef = useRef();

  const debouncedIsShowing = useDebounce(isShowing, 150);

  const handleClickOutside = useCallback(() => {
    if(isShowing) {
      onClose();
    }
  }, [ onClose ]);

  useClickOutside(modalRef, handleClickOutside);

  const handleEscape = useCallback(e => {
    if(e.key === 'Escape') {
      onClose();
    }
  }, [ onClose ]);

  useEffect(() => {
    if(isShowing) {
      document.addEventListener('keydown', handleEscape);

      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [ isShowing, handleEscape ]);

  return <>
    <div className={`opacity-0 transition-all duration-150 ${isShowing ? 'opacity-50 fixed top-0 left-0 w-full h-full bg-gray-900 z-20' : ''}`} />
    <div style={{ maxHeight: '90vh' }} 
      ref={modalRef} 
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 border border-black bg-white z-30 overflow-scroll transition-all duration-150 ${!isShowing ? 'opacity-0 invisible' : ''}`}>
        { (isShowing || debouncedIsShowing) && props.children }
    </div>
  </>;
};