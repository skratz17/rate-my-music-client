import { roundToAtMostDecimalPlaces } from './roundToAtMostDecimalPlaces';

describe('round to at most decimal places functionality', () => {
  test('should not modify representation of integer', () => {
    expect(roundToAtMostDecimalPlaces(1, 2)).toEqual('1');
  });

  test('should not modify number with one decimal place', () => {
    expect(roundToAtMostDecimalPlaces(1.1, 2)).toEqual('1.1');
  });

  test('should not modify number with two decimal places', () => {
    expect(roundToAtMostDecimalPlaces(1.12, 2)).toEqual('1.12');
  });

  test('should reduce number with three decimal places down to two and should round down if number should be rounded down', () => {
    expect(roundToAtMostDecimalPlaces(1.123, 2)).toEqual('1.12');
  });

  test('should reduce number with three decimal places down to two and should round up if number should be rounded up', () => {
    expect(roundToAtMostDecimalPlaces(1.127, 2)).toEqual('1.13');
  });
});