// Lokasi: src/api/axios.ts

import axios from 'axios';

// Ganti dengan URL dasar API backend Anda
const BASE_URL = 'http://localhost:5000/api'; // Contoh, sesuaikan dengan port server Anda

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor untuk menambahkan token otentikasi ke setiap request
api.interceptors.request.use(
    (config) => {
        // Ambil token dari localStorage
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;