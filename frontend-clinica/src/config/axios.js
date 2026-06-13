import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', 
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