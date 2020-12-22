import { request } from '../utils';

export const auth = {
  register: async registrationInfo => {
    const data = await request('/register', 'POST', registrationInfo);
    return data;
  },

  login: async loginInfo => {
    const data = await request('/login', 'POST', loginInfo);
    return data;
  }
};