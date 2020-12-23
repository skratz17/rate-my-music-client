import { request, queryParamsToString } from '../utils';

export const ratings = {
  create: async ratingData => {
    const rating = await request('/ratings', 'POST', ratingData);
    return rating
  },

  update: async (ratingId, ratingData) => {
    const rating = await request(`/ratings/${ratingId}`, 'PUT', ratingData);
    return rating;
  },

  list: async params => {
    const queryParams = queryParamsToString(params);
    const ratings = await request(`/ratings?${queryParams}`);
    return ratings;
  }
};