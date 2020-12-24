import React from 'react';

const YEARS = [];
const currentYear = (new Date()).getFullYear();
for(let i = 1850; i <= currentYear; i++) YEARS.push(i);

export const YearSelect = props => {
  const { name, value, onChange } = props;

  return (
    <select className="p-2 mx-2" id={name} name={name} value={value} onChange={onChange}>
      <option value="">any</option>
      { YEARS.map(year => <option key={year} value={year}>{year}</option>).reverse() }
    </select>
  );
};