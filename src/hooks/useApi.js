import { useState, useEffect } from 'react';

export const useApi = (method, ...params) => {
  const [ data, setData ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const callApi = async () => {
    try {
      setIsLoading(true);
      const data = await method(...params);
      setData(data);
    }
    catch(e) {
      setError(e.message);
    }
    finally {
      setIsLoading(false);
    }
  };

  const stringifiedParams = JSON.stringify(params);
  useEffect(() => { callApi() }, [ stringifiedParams ]);

  return [ data, isLoading, error, callApi ];
};