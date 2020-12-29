import { useState, useEffect } from 'react';

export const usePagination = (resetWatchParams, initialPageSize = 10) => {
  const [ page, setPage ] = useState(1);
  const [ pageSize, setPageSize ] = useState(initialPageSize);

  const stringifiedResetWatchParams = JSON.stringify(resetWatchParams);

  useEffect(() => {
    setPage(1);
  }, [ pageSize, stringifiedResetWatchParams ]);

  const paginationParams = { page, pageSize };
  const paginationFunctions = { 
    setPageSize,
    getNextPage: () => setPage(prevPage => prevPage + 1),
    getPreviousPage: () => setPage(prevPage => prevPage - 1),
    getPage: pageNumber => setPage(pageNumber),
    isLastPage: count => (page * pageSize) >= count
  };

  return [ paginationParams, paginationFunctions ];
};