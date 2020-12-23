import { request } from '../utils';

export const lists = {
  create: async listData => {
    const list = await request('/lists', 'POST', listData);
    return list;
  }
};