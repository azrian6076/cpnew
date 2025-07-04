import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL base dari backend Anda
});

// Interceptor untuk menambahkan token ke setiap request secara otomatis
api.interceptors.request.use(config => {
  // Ambil token dari localStorage (sesuaikan jika Anda menyimpan di tempat lain)
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;