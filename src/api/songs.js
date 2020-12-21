import { request } from '../utils';

export const songs = {
  create: async songData => {
    const song = await request('/songs', 'POST', songData);
    return song;
  }
};