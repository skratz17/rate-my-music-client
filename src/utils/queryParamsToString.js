export const queryParamsToString = params => {
  if(!params) return '';

  return Object.entries(params)
    .map(([ key, value ]) => `${key}=${value}`)
    .join('&');
};