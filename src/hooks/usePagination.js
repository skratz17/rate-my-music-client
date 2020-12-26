import { useState } from 'react';

export const usePagination = (initialPageSize = 10) => {
  const [ page, setPage ] = useState(1);
  const [ pageSize, setPageSize ] = useState(initialPageSize);

  const paginationParams = { page, pageSize };
  const paginationFunctions = { 
    setPageSize,
    getNextPage: () => setPage(prevPage => prevPage + 1),
    getPreviousPage: () => setPage(prevPage => prevPage - 1),
    getPage: pageNumber => setPage(pageNumber),
    isLastPage: count => (page * pageSize) > count
  };

  return [ paginationParams, paginationFunctions ];
};