import Axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const api = Axios.create({
  withCredentials: true,
  baseURL: BASE_URL
});

api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${window.localStorage.getItem('token')}`
  return config;
});

api.interceptors.response.use(config => {
  return config;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
    originalRequest._isRetry = true;
    try {
      const response = await Axios.get('/refresh', {withCredentials: true});
      localStorage.setItem('token', response.data.accessToken);
      return api.request(originalRequest);
    } catch (error) {
      console.log('Authorize error');
    }
  }

  throw error;
});