import React from 'react';

const YEARS = [];
const currentYear = (new Date()).getFullYear();
for(let i = 1850; i <= currentYear; i++) YEARS.push(i);

export const YearSelect = props => {
  const { name, value, onChange } = props;

  return (
    <select name={name} value={value} onChange={onChange}>
      <option value="" disabled>any</option>
      { YEARS.map(year => <option key={year} value={year}>{year}</option>).reverse() }
    </select>
  );
};