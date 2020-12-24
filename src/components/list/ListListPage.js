import React from 'react';

import { api } from '../../api';
import { useApi } from '../../hooks';
import { ListList } from './ListList';
import { LoadingIndicator, WarningText } from '../common';

export const ListListPage = () => {
  const [ lists, isLoading, error ] = useApi(api.lists.list);

  return (
    <div className="max-w-screen-lg mx-auto">
      <section>
        <h2 className="text-4xl text-center">All <span className="text-emerald">Lists</span></h2>
        <LoadingIndicator isLoading={isLoading} />
        <WarningText>{error}</WarningText>
        { lists && <ListList lists={lists} /> }
      </section>
    </div>
  )
};