import React from 'react';

export const PaginationControls = props => {
  const { page, isLastPage, onNextPage, onPreviousPage } = props;

  return (
    <div className="flex justify-evenly items-center">
      <button type="button" disabled={page === 1} onClick={onPreviousPage}>Previous Page</button>

      <span>Page {page}</span>

      <button type="button" disabled={isLastPage} onClick={onNextPage}>Next Page</button>
    </div>
  );
};