import { translateObjectKeys, convertCamelToSnake, convertSnakeToCamel } from './caseConversions';

const API_BASE = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API : process.env.REACT_APP_DEV_API;

/**
 * Fetch wrapper to automate repetitive fetch tasks.
 * @param {String} location URL location to make the request to.
 * @param {String} method HTTP verb to use for the request.
 * @param {Object} body Body of the request, if POST or PUT
 * @returns {Response or Object} Returns parsed JSON body of response if JSON body exists, or otherwise the fetch Response.
 * @throws Throws an error if fetch response status code >= 400, error body will contain error description from server.
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

  const fetchResponse = await fetch(fullLocation, options);
  if(fetchResponse.status >= 400) {
    throw new Error((await fetchResponse.json()).message || 'Something went wrong :/.');
  }

  try {
    const data = await fetchResponse.json();
    return translateObjectKeys(data, convertSnakeToCamel);
  }
  catch(e) {
    return fetchResponse;
  }
};
