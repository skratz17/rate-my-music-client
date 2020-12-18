import { request } from '../utils/request';

export const user = {
  getCurrentData: async () => {
    const user = await request('/raters');
    return user;
  }
}