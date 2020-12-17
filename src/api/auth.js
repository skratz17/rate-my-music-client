import { request } from '../utils/request';

export const auth = {
  register: async registrationInfo => {
    const response = await request('/register', 'POST', registrationInfo);
    const data = await response.json();
    if(response.status >= 400) {
      throw new Error(data.message || 'Something went wrong :/.');
    }
    return data;
  },

  login: async loginInfo => {
    const response = await request('/login', 'POST', loginInfo);
    const data = await response.json();
    if(response.status >= 400) {
      throw new Error(data.message || 'Something went wrong :/.');
    }
    return data;
  }
};