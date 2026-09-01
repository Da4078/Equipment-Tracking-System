import api from '../api/axios.js';

const equipmentService = {
    getAll: (page = 0, size = 10, filter = '') => {
        const url = filter
            ? `/equipment?page=${page}&size=${size}&filter=${filter}`
            : `/equipment?page=${page}&size=${size}`;
        return api.get(url);
    },
    getById: (id) => api.get(`/equipment/${id}`),
    create: (equipmentData) => api.post('/equipment', equipmentData),
    update: (id, equipmentData) => api.put(`/equipment/${id}`, equipmentData),
    delete: (id) => api.delete(`/equipment/${id}`),

    // Additional endpoints
    getAvailable: () => api.get('/equipment/available'),
    getOutstanding: () => api.get('/equipment/outstanding'),
    getByEmployee: (employeeId) => api.get(`/equipment/employee/${employeeId}`)
};

export default equipmentService;