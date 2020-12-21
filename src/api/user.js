import { request } from '../utils';

export const user = {
  getCurrentData: async () => {
    const user = await request('/raters');
    return user;
  }
}