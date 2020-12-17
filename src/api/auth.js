import { request } from '../utils/request';
import { convertCamelToSnake, translateObjectKeys } from '../utils/caseConversions';

export const auth = {
  register: async registrationInfo => {
    const translatedRegistrationInfo = translateObjectKeys(registrationInfo, convertCamelToSnake);
    const response = await request('/register', 'POST', translatedRegistrationInfo);
    const data = await response.json();
    if(response.status >= 400) {
      throw new Error(data.message || 'Something went wrong :/.');
    }
    return data;
  }
};