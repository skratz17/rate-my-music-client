import React from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

export const PaginationControls = props => {
  const { page, pageSize, isLastPage, onNextPage, onPreviousPage, onSetPageSize } = props;

  const renderPageSizeControl = val => (
    <button key={val}
      onClick={() => onSetPageSize(val)}
      className={`mx-1 hover:text-gray-600 ${val === pageSize ? 'font-bold' : ''}`}>
        {val}
    </button>
  )

  return (
    <div className="flex flex-col md:flex-row justify-between items-center relative my-2">
      <div className="flex justify-center items-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <button type="button" 
          className="bg-gray-200 hover:bg-gray-300 disabled:cursor-auto disabled:opacity-30"
          disabled={page === 1} 
          onClick={onPreviousPage}>
            <MdNavigateBefore className="text-xl" />
            <span className="sr-only">Previous Page</span>
        </button>

        <span className="mx-2">Page {page}</span>

        <button type="button" 
          className="bg-gray-200 hover:bg-gray-300 disabled:cursor-auto disabled:opacity-30"
          disabled={isLastPage} 
          onClick={onNextPage}>
            <MdNavigateNext className="text-xl" />
            <span className="sr-only">Next Page</span>
        </button>
      </div>

      <div className="flex md:ml-auto">
        <span>Items per page:</span>
        { [10, 25, 50].map(val => renderPageSizeControl(val))}
      </div>
    </div>
  );
};