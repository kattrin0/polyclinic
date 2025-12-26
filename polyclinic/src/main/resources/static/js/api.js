// ============================================
// API SERVICE
// ============================================

const API = {
    baseURL: '/api',

    init() {
        axios.defaults.baseURL = this.baseURL;
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    Store.logout();
                    router.push('/login');
                }
                return Promise.reject(error);
            }
        );
    },

    // ==================== AUTH ====================
    auth: {
        async login(email, password) {
            const response = await axios.post('/auth/login', { email, password });
            return response.data;
        },
        async register(userData) {
            const response = await axios.post('/auth/register', userData);
            return response.data;
        },
        async logout() {
            await axios.post('/auth/logout');
        },
        async getCurrentUser() {
            const response = await axios.get('/auth/me');
            return response.data;
        },
        async updateProfile(userData) {
            const response = await axios.put('/auth/profile', userData);
            return response.data;
        }
    },

    // ==================== DEPARTMENTS ====================
    departments: {
        async getAll() {
            const response = await axios.get('/departments');
            return response.data;
        },
        async getById(id) {
            const response = await axios.get(`/departments/${id}`);
            return response.data;
        },
        async create(data) {
            const response = await axios.post('/departments', data);
            return response.data;
        },
        async update(id, data) {
            const response = await axios.put(`/departments/${id}`, data);
            return response.data;
        },
        async delete(id) {
            await axios.delete(`/departments/${id}`);
        }
    },

    // ==================== DOCTORS ====================
    doctors: {
        async getAll() {
            const response = await axios.get('/doctors');
            return response.data;
        },
        async getAllPaginated(params = {}) {
            const query = new URLSearchParams({
                page: params.page || 0,
                paginated: true,
                sortBy: params.sortBy || 'id',
                sortDir: params.sortDir || 'asc'
            });
            if (params.departmentId) query.append('departmentId', params.departmentId);
            if (params.active !== null && params.active !== undefined) query.append('active', params.active);

            const response = await axios.get(`/doctors?${query}`);
            return response.data;
        },
        async getActive() {
            const response = await axios.get('/doctors?active=true');
            return response.data;
        },
        async getById(id) {
            const response = await axios.get(`/doctors/${id}`);
            return response.data;
        },
        async getByDepartment(departmentId) {
            const response = await axios.get(`/doctors?departmentId=${departmentId}`);
            return response.data;
        },
        async create(data) {
            const response = await axios.post('/doctors', data);
            return response.data;
        },
        async update(id, data) {
            const response = await axios.put(`/doctors/${id}`, data);
            return response.data;
        },
        async toggleActive(id) {
            const response = await axios.patch(`/doctors/${id}/toggle-active`);
            return response.data;
        },
        async delete(id) {
            await axios.delete(`/doctors/${id}`);
        }
    },

    // ==================== SERVICES ====================
    services: {
        async getAll() {
            const response = await axios.get('/services');
            return response.data;
        },
        async getAllPaginated(params = {}) {
            const query = new URLSearchParams({
                page: params.page || 0,
                paginated: true,
                sortBy: params.sortBy || 'id',
                sortDir: params.sortDir || 'asc'
            });
            if (params.departmentId) query.append('departmentId', params.departmentId);

            const response = await axios.get(`/services?${query}`);
            return response.data;
        },
        async getById(id) {
            const response = await axios.get(`/services/${id}`);
            return response.data;
        },
        async getByDepartment(departmentId) {
            const response = await axios.get(`/services?departmentId=${departmentId}`);
            return response.data;
        },
        async create(data) {
            const response = await axios.post('/services', data);
            return response.data;
        },
        async update(id, data) {
            const response = await axios.put(`/services/${id}`, data);
            return response.data;
        },
        async delete(id) {
            await axios.delete(`/services/${id}`);
        }
    },

    // ==================== APPOINTMENTS ====================
    appointments: {
        async getAll(params = {}) {
            const query = new URLSearchParams({
                page: params.page || 0,
                sortBy: params.sortBy || 'id',
                sortDir: params.sortDir || 'desc'
            });
            if (params.status) query.append('status', params.status);
            if (params.doctorId) query.append('doctorId', params.doctorId);

            const response = await axios.get(`/appointments?${query}`);
            return response.data;
        },
        async getMy() {
            const response = await axios.get('/appointments/my');
            return response.data;
        },
        async create(data) {
            const response = await axios.post('/appointments', data);
            return response.data;
        },
        async updateStatus(id, status) {
            const response = await axios.patch(`/appointments/${id}/status`, { status });
            return response.data;
        },
        async cancel(id) {
            const response = await axios.patch(`/appointments/${id}/cancel`);
            return response.data;
        },
        async delete(id) {
            await axios.delete(`/appointments/${id}`);
        }
    },

    // ==================== USERS ====================
    users: {
        async getAll(params = {}) {
            const query = new URLSearchParams({
                page: params.page || 0,
                sortBy: params.sortBy || 'id',
                sortDir: params.sortDir || 'asc'
            });
            if (params.isAdmin !== null && params.isAdmin !== undefined) {
                query.append('isAdmin', params.isAdmin);
            }

            const response = await axios.get(`/users?${query}`);
            return response.data;
        },
        async getById(id) {
            const response = await axios.get(`/users/${id}`);
            return response.data;
        },
        async update(id, data) {
            const response = await axios.put(`/users/${id}`, data);
            return response.data;
        },
        async toggleAdmin(id) {
            const response = await axios.patch(`/users/${id}/toggle-admin`);
            return response.data;
        },
        async delete(id) {
            await axios.delete(`/users/${id}`);
        }
    },

    // ==================== STATISTICS ====================
    stats: {
        async getDashboard() {
            const response = await axios.get('/stats/dashboard');
            return response.data;
        }
    }
};

API.init();