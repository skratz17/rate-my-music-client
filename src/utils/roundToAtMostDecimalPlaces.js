export const roundToAtMostDecimalPlaces = (num, maximumFractionDigits = 2) => (
  num.toLocaleString(undefined, { maximumFractionDigits, minimumFractionDigits: 0 })
);