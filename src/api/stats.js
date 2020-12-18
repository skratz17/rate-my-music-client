import { request } from '../utils/request';

export const stats = {
  get: async () => {
    const stats = await request('/stats');
    return stats;
  }
};