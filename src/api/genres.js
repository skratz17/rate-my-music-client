import { request, queryParamsToString } from '../utils';

export const genres = {
  list: async params => {
    const queryParams = queryParamsToString(params);
    const genres = await request(`/genres?${queryParams}`);
    return genres;
  }
};