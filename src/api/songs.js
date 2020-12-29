import { request, queryParamsToString } from '../utils';

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
  },
  
  list: async params => {
    const queryParams = queryParamsToString(params);
    const songs = await request(`/songs?${queryParams}`);
    return songs;
  },

  delete: async songId => {
    return await request(`/songs/${songId}`, 'DELETE');
  },

  search: async searchTerm => {
    return await songs.list({ q: searchTerm });
  }
};