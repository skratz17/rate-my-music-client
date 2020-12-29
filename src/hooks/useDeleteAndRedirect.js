import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export const useDeleteAndRedirect = (deleteFunction, id, redirectTo = '/') => {
  const history = useHistory();

  const [ error, setError ] = useState('');

  const handleDelete = async () => {
    try {
      await deleteFunction(id);
      history.push(redirectTo);
    }
    catch(e) {
      setError(e.message);
    }
  };

  return [ handleDelete, error ];
};