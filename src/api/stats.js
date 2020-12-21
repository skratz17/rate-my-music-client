import { request } from '../utils';

export const stats = {
  get: async () => {
    const stats = await request('/stats');
    return stats;
  }
};