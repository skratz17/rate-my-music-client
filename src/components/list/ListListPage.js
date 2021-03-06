import React from 'react';

import { api } from '../../api';
import { usePagination, useApi } from '../../hooks';
import { ListList } from './ListList';
import { Page, LoadingWrapper, WarningText, PaginationControls } from '../common';

export const ListListPage = () => {
  const [ paginationParams, paginationFunctions ] = usePagination();
  const [ listsResponse, isLoading, error ] = useApi(api.lists.list, { ...paginationParams });

  const lists = listsResponse?.data;
  const count = listsResponse?.count;

  return (
    <Page>
      <LoadingWrapper isLoading={isLoading}>
        <section>
          <h2 className="text-4xl text-center">All <span className="text-emerald">Lists</span></h2>
          <WarningText>{error}</WarningText>
          { lists && 
            <div>
              <ListList lists={lists} /> 
              <PaginationControls page={paginationParams.page}
                pageSize={paginationParams.pageSize}
                isLastPage={paginationFunctions.isLastPage(count)}
                onSetPageSize={paginationFunctions.setPageSize}
                onPreviousPage={paginationFunctions.getPreviousPage}
                onNextPage={paginationFunctions.getNextPage} />
            </div>
          }
        </section>
      </LoadingWrapper>
    </Page>
  );
};