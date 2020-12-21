import { request } from '../utils/request';

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
  }
}