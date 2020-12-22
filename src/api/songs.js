import { request } from '../utils';

export const songs = {
  create: async songData => {
    const song = await request('/songs', 'POST', songData);
    return song;
  },

  get: async songId => {
    const song = await request(`/songs/${songId}`);
    return song;
  },

  update: async (songId, songData) => {
    const song = await request(`/songs/${songId}`, 'PUT', songData);
    return song;
  }
};