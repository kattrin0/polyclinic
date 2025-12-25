// ============================================
// API SERVICE - Все запросы к бэкенду
// ============================================

const API = {
    baseURL: '/api',

    // Настройка axios
    init() {
        axios.defaults.baseURL = this.baseURL;
        axios.defaults.headers.common['Content-Type'] = 'application/json';

        // Интерцептор для обработки ошибок
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
        async getAll(page = 0, size = 10) {
            const response = await axios.get(`/appointments?page=${page}&size=${size}`);
            return response.data;
        },

        async getMy() {
            const response = await axios.get('/appointments/my');
            return response.data;
        },

        async getById(id) {
            const response = await axios.get(`/appointments/${id}`);
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
        },

        async getAvailableSlots(doctorId, date) {
            const response = await axios.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`);
            return response.data;
        }
    },

   // ==================== USERS (Admin) ====================
    users: {
      async getAll(page = 0, size = 20) {
        const response = await axios.get(`/users?page=${page}&size=${size}`);
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

    // ==================== STATISTICS (Admin) ====================
    stats: {
        async getDashboard() {
            const response = await axios.get('/stats/dashboard');
            return response.data;
        }
    }
};

// Инициализация
API.init();