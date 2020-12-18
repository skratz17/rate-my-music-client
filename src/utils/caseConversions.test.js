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

describe('converting object keys', () => {
  test('should convert object keys from camel case to snake case', () => {
    const obj = { firstName: 'jacob', lastName: 'eckert', password: 'test' };

    const translatedObj = translateObjectKeys(obj, convertCamelToSnake);

    expect(translatedObj).not.toHaveProperty('firstName');
    expect(translatedObj).toHaveProperty('first_name');
    expect(translatedObj).not.toHaveProperty('lastName');
    expect(translatedObj).toHaveProperty('last_name');
    expect(translatedObj).toHaveProperty('password');

    expect(translatedObj.first_name).toEqual('jacob');
    expect(translatedObj.last_name).toEqual('eckert');
    expect(translatedObj.password).toEqual('test');
  });

  test('should convert object keys from snake case to camel case', () => {
    const obj = { first_name: 'jacob', last_name: 'eckert', password: 'test' };

    const translatedObj = translateObjectKeys(obj, convertSnakeToCamel);

    expect(translatedObj).not.toHaveProperty('first_name');
    expect(translatedObj).toHaveProperty('firstName');
    expect(translatedObj).not.toHaveProperty('last_name');
    expect(translatedObj).toHaveProperty('lastName');
    expect(translatedObj).toHaveProperty('password');

    expect(translatedObj.firstName).toEqual('jacob');
    expect(translatedObj.lastName).toEqual('eckert');
    expect(translatedObj.password).toEqual('test');
  });

  test('should properly convert keys in nested objects or arrays', () => {
    const obj = {
      id: 1,
      null: null,
      userInfo: {
        firstName: 'jacob',
        lastName: 'eckert',
        password: 'test'
      },
      favoriteColors: [ 'red', 'green', 'blue' ],
      favoriteSongs: [
        { songName: 'Save a Secret for the Moon', artistName: 'The Magnetic Fields' },
        { songName: 'Baby', artistName: 'of Montreal'}
      ]
    };

    const translatedObj = translateObjectKeys(obj, convertCamelToSnake);

    // check top level
    expect(translatedObj).toHaveProperty('id');
    expect(translatedObj).toHaveProperty('null');
    expect(translatedObj).toHaveProperty('user_info');
    expect(translatedObj).toHaveProperty('favorite_colors');
    expect(translatedObj).toHaveProperty('favorite_songs');
    expect(translatedObj).not.toHaveProperty('userInfo');
    expect(translatedObj).not.toHaveProperty('favoriteColors');
    expect(translatedObj).not.toHaveProperty('favoriteSongs');
    expect(translatedObj.id).toEqual(1);
    expect(translatedObj.null).toEqual(null);

    // check nested object
    expect(translatedObj.user_info).toHaveProperty('first_name');
    expect(translatedObj.user_info).toHaveProperty('last_name');
    expect(translatedObj.user_info).toHaveProperty('password');
    expect(translatedObj.user_info).not.toHaveProperty('firstName');
    expect(translatedObj.user_info).not.toHaveProperty('lastName');
    expect(translatedObj.user_info.first_name).toEqual('jacob');
    expect(translatedObj.user_info.last_name).toEqual('eckert');
    expect(translatedObj.user_info.password).toEqual('test');

    // check nested string array
    expect(translatedObj.favorite_colors).toHaveLength(3);
    expect(translatedObj.favorite_colors).toEqual(expect.arrayContaining([ 'red', 'green', 'blue' ]));

    // check nested array of objects
    expect(translatedObj.favorite_songs).toHaveLength(2);
    expect(translatedObj.favorite_songs[0]).toHaveProperty('song_name');
    expect(translatedObj.favorite_songs[0]).toHaveProperty('artist_name');
    expect(translatedObj.favorite_songs[0]).not.toHaveProperty('songName');
    expect(translatedObj.favorite_songs[0]).not.toHaveProperty('artistName');

    expect(translatedObj.favorite_songs[1]).toHaveProperty('song_name');
    expect(translatedObj.favorite_songs[1]).toHaveProperty('artist_name');
    expect(translatedObj.favorite_songs[1]).not.toHaveProperty('songName');
    expect(translatedObj.favorite_songs[1]).not.toHaveProperty('artistName');

    expect(translatedObj.favorite_songs[0].song_name).toEqual('Save a Secret for the Moon');
    expect(translatedObj.favorite_songs[0].artist_name).toEqual('The Magnetic Fields');

    expect(translatedObj.favorite_songs[1].song_name).toEqual('Baby');
    expect(translatedObj.favorite_songs[1].artist_name).toEqual('of Montreal');
  });

  test('should properly convert top-level arrays of objects', () => {
    const arr = [
      { firstName: 'jacob', lastName: 'eckert' },
      { firstName: 'test', lastName: 'user' }
    ];

    const translatedObj = translateObjectKeys(arr, convertCamelToSnake);

    expect(translatedObj).toHaveLength(2);
    expect(translatedObj[0]).toHaveProperty('first_name');
    expect(translatedObj[0]).toHaveProperty('last_name');
    expect(translatedObj[0]).not.toHaveProperty('firstName');
    expect(translatedObj[0]).not.toHaveProperty('lastName');

    expect(translatedObj[1]).toHaveProperty('first_name');
    expect(translatedObj[1]).toHaveProperty('last_name');
    expect(translatedObj[1]).not.toHaveProperty('firstName');
    expect(translatedObj[1]).not.toHaveProperty('lastName');

    expect(translatedObj[0].first_name).toEqual('jacob');
    expect(translatedObj[0].last_name).toEqual('eckert');
    expect(translatedObj[1].first_name).toEqual('test');
    expect(translatedObj[1].last_name).toEqual('user');
  });

  test('should properly handle top-level arrays of primitives', () => {
    const arr = [ 1, 'string', null, undefined ];

    const translatedObj = translateObjectKeys(arr, convertCamelToSnake);

    expect(translatedObj).toHaveLength(4);
    expect(translatedObj).toEqual(expect.arrayContaining([ 1, 'string', null, undefined ]));
  });
});