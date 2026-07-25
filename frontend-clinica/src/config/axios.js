import axios from 'axios';

const api = axios.create({
    // Con VITE_API_BASE=/api las peticiones pasan por el proxy de Vite (necesario para ngrok).
    baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080/api',
});

// INTERCEPTOR DE SOLICITUD (REQUEST)
// Se ejecuta antes de que la petición salga a mi navegador
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Buscar el token guardado
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