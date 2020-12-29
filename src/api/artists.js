import { request, queryParamsToString } from '../utils';

export const artists = {
  create: async artistData => {
    const artist = await request('/artists', 'POST', artistData);
    return artist;
  },

  get: async artistId => {
    const artist = await request(`/artists/${artistId}`);
    return artist;
  },

  update: async (artistId, artistData) => {
    const artist = await request(`/artists/${artistId}`, 'PUT', artistData);
    return artist;
  },

  list: async params => {
    const queryParams = queryParamsToString(params);
    const artists = await request(`/artists?${queryParams}`);
    return artists;
  },

  delete: async artistId => {
    return await request(`/artists/${artistId}`, 'DELETE');
  },

  search: async searchTerm => {
    return await artists.list({ q: searchTerm });
  }
}