import { request, queryParamsToString } from '../utils';

export const ratings = {
  list: async params => {
    const queryParams = queryParamsToString(params);
    const ratings = await request(`/ratings?${queryParams}`);
    return ratings;
  }
};