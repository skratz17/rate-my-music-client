import React from 'react';
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md';

const ALL_ORDER_BY_FIELDS = [
  { name: 'year', displayName: 'Year' },
  { name: 'name', displayName: 'Name' },
  { name: 'avgRating', displayName: 'Average Rating' },
  { name: 'artist', displayName: 'Artist' }
];

export const SongListSortOptions = props => {
  const { fields, orderingData, onSelectSortOption } = props;
  const { orderBy, direction } = orderingData;

  const renderedOrderByFields = fields || [ 'year', 'name', 'avgRating', 'artist' ];

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
      { renderedOrderByFields.map(field => {
        const { displayName } = ALL_ORDER_BY_FIELDS.find(fieldData => fieldData.name === field);

        const isCurrentlySortedField = field === orderBy;

        let icon = null;
        if(isCurrentlySortedField && direction === 'asc') icon = <MdKeyboardArrowUp />;
        else if(isCurrentlySortedField && direction === 'desc') icon = <MdKeyboardArrowDown />;

        return (
          <button key={field} 
            className={`mx-1 flex items-center hover:text-gray-800 ${isCurrentlySortedField ? 'font-bold' : ''}`} 
            onClick={() => handleSortOptionClick(field)}
          >
            <span>{ displayName }</span>
            { icon }
          </button>
        )
      })}
    </div>
  );
};