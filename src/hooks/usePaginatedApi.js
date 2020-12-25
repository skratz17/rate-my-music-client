import { useState } from 'react';
import { useApi } from './useApi';

export const usePaginatedApi = (method, queryStringParams = {}, ...params) => {
  const [ page, setPage ] = useState(1);
  const [ pageSize, setPageSize ] = useState(10);

  const paginationData = {
    page,
    pageSize,
    setPageSize,
    getNextPage: () => setPage(prevPage => prevPage + 1),
    getPreviousPage: () => setPage(prevPage => prevPage - 1),
    getPage: pageNumber => setPage(pageNumber)
  };

  const [ results, isLoading, error, callApi ] = useApi(method, { ...queryStringParams, page, pageSize }, ...params);

  return [ paginationData, results, isLoading, error, callApi ];
};