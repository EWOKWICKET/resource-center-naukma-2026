import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { default: router } = await import('@/router');
      router.push('/login');
    }
    return Promise.reject(error);
  },
);

export default http;
