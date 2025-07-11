import axios from 'axios';

const authorizedAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + 'api/v1/',
});

authorizedAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

authorizedAxios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');

            const referrer = document.referrer;
            const redirectUrl = referrer.includes('/admin') ? '/admin/login' : '/login';

            window.location.href = redirectUrl;
        }

        return Promise.reject(error);
    }
);
export default authorizedAxios;
