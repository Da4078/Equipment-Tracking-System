import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        let message = "An unexpected error occurred";
        if(error.response?.data){
            const data = error.response.data;
            if (typeof data === 'string') {
                message = data;
            } else if (data.message) {
                message = data.message;
            } else if (typeof data === 'object') {
                // Form field validation errors ({ field: "error description" })
                message = Object.values(data).join(', ');
            }
        }
        return Promise.reject(new Error(message));
    }
)

export default api;