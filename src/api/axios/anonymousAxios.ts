import axios from 'axios';

const anonymousAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + 'api/v1/'
});

export default anonymousAxios;