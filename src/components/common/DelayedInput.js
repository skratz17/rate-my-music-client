import React, { useState, useEffect } from 'react';

import { useDebounce } from '../../hooks';
import loadingGif from '../../assets/loading.gif';

export const DelayedInput = props => {
  const { duration, onDelayedChange, onFocus, isLoading, name, className, placeholder } = props;

  const [ inputValue, setInputValue ] = useState('');
  const [ hasChanged, setHasChanged ] = useState(false);

  const debouncedInputValue = useDebounce(inputValue, duration || 500);

  useEffect(() => {
    if(hasChanged) {
      onDelayedChange(debouncedInputValue);
    }
  }, [ debouncedInputValue ]);

  const handleChange = e => {
    setInputValue(e.target.value);
    setHasChanged(true);
  };

  return (
    <div className="flex items-center relative">
      <input name={name} id={name} 
        className={`flex-grow ${className || ''}`} 
        type="text" 
        value={inputValue} 
        placeholder={placeholder || ''}
        onFocus={onFocus || (() => {})}
        onChange={handleChange} />
      { <div style={((inputValue !== debouncedInputValue) || isLoading) ? { backgroundImage: `url(${loadingGif})`} : {}} className="bg-cover h-6 w-6 mx-2 flex-grow-0 absolute right-0" /> }
    </div>
  );
};