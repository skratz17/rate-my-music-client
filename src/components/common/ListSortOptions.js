import React from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';

export const ListSortOptions = props => {
  const { fields, orderingData, onSelectSortOption } = props;
  const { orderBy, direction } = orderingData;

  const handleSortOptionClick = sortOption => {
    let updatedDirection = 'asc';
    if(sortOption === orderBy && direction === 'asc') updatedDirection = 'desc';

    onSelectSortOption({
      orderBy: sortOption,
      direction: updatedDirection
    });
  }

  return (
    <div className="flex items-center">
      <span className="mr-1 text-sm">Order By:</span>
      { fields.map(({ name, displayName }) => {
        const isCurrentlySortedField = name === orderBy;

        let icon = null;
        if(isCurrentlySortedField && direction === 'asc') icon = <MdKeyboardArrowUp />;
        else if(isCurrentlySortedField && direction === 'desc') icon = <MdKeyboardArrowDown />;

        return (
          <button key={name} 
            className={`mx-1 flex items-center hover:text-gray-800 ${isCurrentlySortedField ? 'font-bold' : ''}`} 
            onClick={() => handleSortOptionClick(name)}
          >
            <span>{ displayName }</span>
            { icon }
          </button>
        )
      })}
    </div>
  );
};