import { request, queryParamsToString } from '../utils';

export const lists = {
  create: async listData => {
    const list = await request('/lists', 'POST', listData);
    return list;
  },

  get: async listId => {
    const list = await request(`/lists/${listId}`);
    return list;
  },

  update: async (listId, listData) => {
    const list = await request(`/lists/${listId}`, 'PUT', listData);
    return list;
  },

  list: async params => {
    const queryParams = queryParamsToString(params);
    const lists = await request(`/lists?${queryParams}`);
    return lists;
  }
};