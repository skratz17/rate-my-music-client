import { request } from '../utils';

export const search = {
  search: async searchTerm => {
    const results = await request(`/search?q=${searchTerm}`);
    return results;
  }
}