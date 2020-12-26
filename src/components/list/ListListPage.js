import React from 'react';

import { api } from '../../api';
import { usePagination, useApi } from '../../hooks';
import { ListList } from './ListList';
import { Page, LoadingIndicator, WarningText, PaginationControls } from '../common';

export const ListListPage = () => {
  const [ paginationParams, paginationFunctions ] = usePagination();
  const [ lists, isLoading, error ] = useApi(api.lists.list, { ...paginationParams });

  return (
    <Page>
      <section>
        <h2 className="text-4xl text-center">All <span className="text-emerald">Lists</span></h2>
        <LoadingIndicator isLoading={!lists && isLoading} />
        <WarningText>{error}</WarningText>
        { lists && 
          <div>
            <ListList lists={lists} /> 
            <PaginationControls page={paginationParams.page}
              onPreviousPage={paginationFunctions.getPreviousPage}
              onNextPage={paginationFunctions.getNextPage} />
          </div>
        }
      </section>
    </Page>
  );
};