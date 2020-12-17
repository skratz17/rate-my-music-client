export const convertCamelToSnake = str => {
  let output = '';
  for(const char of str.split('')) {
    if(char.toUpperCase() === char) output += `_${char.toLowerCase()}`;
    else output += char;
  }
  return output;
};

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

// TODO: make this work with nested objects
export const translateObjectKeys = (obj, transformer) => {
  const resultingObj = {};

  for(const [ key, value ] of Object.entries(obj)) {
    resultingObj[transformer(key)] = value;
  };

  return resultingObj;
};