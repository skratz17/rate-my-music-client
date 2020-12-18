import React from 'react';

import { WarningText } from './WarningText';

export const FormControl = props => {
  const { type, name, register, label, error } = props;

  const renderFormControl = type => {
    switch(type) {
      case "password":
        return <input className="p-2" type="password" name={name} id={name} ref={register} />;
      case "textarea":
        return <textarea name={name} id={name} ref={register} />
      default:
        return <input className="p-2" type="text" name={name} id={name} ref={register} />;
    }
  };

  return (
    <div className="flex flex-col my-2">
      <label htmlFor={name}>{label}</label>
      <WarningText>{error}</WarningText>
      { renderFormControl(type) }
    </div>
  );
};