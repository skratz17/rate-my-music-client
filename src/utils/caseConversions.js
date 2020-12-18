/**
 * Given a string assumed to be in camelCase, return the given string transformed into snake_case.
 * @param {string} str The string to transform.
 */
export const convertCamelToSnake = str => {
  let output = '';
  for(const char of str.split('')) {
    if(char.toUpperCase() === char) output += `_${char.toLowerCase()}`;
    else output += char;
  }
  return output;
};

/**
 * Given a string assumed to be in snake_case, return the given string transformed into camelCase.
 * @param {string} str The string to transform.
 */
export const convertSnakeToCamel = str => {
  let output = '';
  let upperCaseFlag = false;
  for(const char of str.split('')) {
    if(char === '_') {
      upperCaseFlag = true;
    }
    else {
      output += upperCaseFlag ? char.toUpperCase() : char;
      upperCaseFlag = false;
    }
  }
  return output;
};

/**
 * Given an object and a function to transform key names in the object, create and return a new object such that:
 *  - For any key S in the original object, the same value is present in the returned object at key transformer(S).
 *  - For any nested array or object in the given object, the same logic is applied.
 * @param {object or array} obj The object to transform keys for.
 * @param {function} transformer Function dictating how the keys should be transformed.
 */
export const translateObjectKeys = (obj, transformer) => {

  // if object is array we need to recursively translate all values in the array only if they are an object or an array
  if(Array.isArray(obj)) {
    return obj.map(v => typeof v === 'object' && v !== null ? translateObjectKeys(v, transformer) : v);
  }

  const transformedObj = {};

  for(const [ key, value ] of Object.entries(obj)) {
    const transformedKey = transformer(key);
    let transformedValue = value; 

    // if value is array or object we need to recursively translate its keys as well
    if(typeof value === 'object' && value !== null) {
      transformedValue = translateObjectKeys(value, transformer);
    }

    transformedObj[transformedKey] = transformedValue;
  };

  return transformedObj;
};