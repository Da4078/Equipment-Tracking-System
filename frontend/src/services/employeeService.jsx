import api from "../api/axios.js";

const employeeService = {
    getAll: (page = 0, size = 10) => api.get(`/employees?page=${page}&size=${size}`),
    getById: (id) => api.get(`/employees/${id}`),
    create: (employeeData) => api.post('/employees', employeeData),
    update: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
    offboard: (id) => api.patch(`/employees/${id}/offboard`)
}

export default employeeService;