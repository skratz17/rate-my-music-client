import { translateObjectKeys, convertCamelToSnake } from './caseConversions';

const API_BASE = 'http://localhost:8000';

/**
 * Basic fetch wrapper to automate repetitive fetch tasks.
 * @param {String} location URL location to make the request to.
 * @param {String} method HTTP verb to use for the request.
 * @param {Object} body Body of the request, if POST or PUT
 * @returns {Promise} Promise returned by underlying fetch call.
 */
export const request = async (location, method = 'GET', body) => {
  const fullLocation = API_BASE + location;

  const headers = {
    'Authorization': `Token ${localStorage.getItem('rmm_user')}`
  };

  if(method === 'POST' || method === 'PUT') {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers
  };

  if(body) {
    const translatedBody = translateObjectKeys(body, convertCamelToSnake);
    options.body = JSON.stringify(translatedBody);
  }

  return await fetch(fullLocation, options);
};
