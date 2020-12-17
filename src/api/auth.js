import { request } from '../utils/request';

export const auth = {
  register: async registrationInfo => {
    const response = await request('/register', 'POST', registrationInfo);
    return await response.json();
  }
};