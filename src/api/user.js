import { request } from '../utils';

export const user = {
  getCurrentData: async () => {
    const user = await request('/raters');
    return user;
  },

  get: async userId => {
    const user = await request(`/raters/${userId}`);
    return user;
  }
}