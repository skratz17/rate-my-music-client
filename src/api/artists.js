import { request } from '../utils/request';

export const artists = {
  create: async artistData => {
    const artist = await request('/artists', 'POST', artistData);
    return artist;
  }
}