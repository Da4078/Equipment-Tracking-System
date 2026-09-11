import axios from 'axios';
import keycloak from '../auth/keycloak';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
    if (keycloak.authenticated) {
        try {
            await keycloak.updateToken(30);
            if (keycloak.token) {
                config.headers.Authorization = `Bearer ${keycloak.token}`;
            }
        } catch (err) {
            console.error('Failed to refresh Keycloak token:', err);
        }
    }
    return config;
});

export default api;