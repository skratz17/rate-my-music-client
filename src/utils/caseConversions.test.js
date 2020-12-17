import { convertCamelToSnake, convertSnakeToCamel, translateObjectKeys } from './caseConversions';

describe('converting camel to snake', () => {
  test('should convert firstName to first_name', () => {
    expect(convertCamelToSnake('firstName')).toBe('first_name');
  });

  test('should convert password to password', () => {
    expect(convertCamelToSnake('password')).toBe('password');
  });
});

describe('converting snake to camel', () => {
  test('should convert first_name to firstName', () => {
    expect(convertSnakeToCamel('first_name')).toBe('firstName');
  });

  test('should convert password to password', () => {
    expect(convertSnakeToCamel('password')).toBe('password');
  });
});

describe('converting object keys to snake', () => {
  test('should convert object keys to snake case', () => {
    const obj = { firstName: 'jacob', lastName: 'eckert', password: 'test' };

    const translatedObj = translateObjectKeys(obj, convertCamelToSnake);

    expect(translatedObj).not.toHaveProperty('firstName');
    expect(translatedObj).toHaveProperty('first_name');
    expect(translatedObj).not.toHaveProperty('lastName');
    expect(translatedObj).toHaveProperty('last_name');
    expect(translatedObj).toHaveProperty('password');
  });
});