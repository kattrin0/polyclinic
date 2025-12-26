// ============================================
// АДМИН-ПАНЕЛЬ - ПРОДОЛЖЕНИЕ
// ============================================

// ==================== ADMIN DOCTORS ====================
const AdminDoctors = {
    template: `
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Управление врачами</h4>
                <p class="text-muted mb-0">Всего: {{ filteredDoctors.length }} врачей</p>
            </div>
            <button class="btn btn-primary" @click="openCreateModal">
                <i class="bi bi-plus-lg me-1"></i> Добавить врача
            </button>
        </div>

        <!-- Фильтры -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Отделение</label>
                        <select v-model="filters.departmentId" class="form-select" @change="currentPage = 0">
                            <option :value="null">Все отделения</option>
                            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                {{ dept.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Статус</label>
                        <select v-model="filters.active" class="form-select" @change="currentPage = 0">
                            <option :value="null">Все</option>
                            <option :value="true">Активные</option>
                            <option :value="false">Неактивные</option>
                        </select>
                    </div>
                    <div class="col-md-4 d-flex align-items-end">
                        <button class="btn btn-outline-secondary" @click="resetFilters">
                            <i class="bi bi-x-circle me-1"></i> Сбросить
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <loading-spinner v-if="loading" message="Загрузка врачей..." />

        <div v-else class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>ФИО</th>
                                <th>Специализация</th>
                                <th>Отделение</th>
                                <th>Статус</th>
                                <th class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="doctor in paginatedDoctors" :key="doctor.id">
                                <td>{{ doctor.id }}</td>
                                <td><strong>{{ doctor.fullName }}</strong></td>
                                <td>{{ doctor.specialization }}</td>
                                <td>{{ doctor.departmentName }}</td>
                                <td>
                                    <span class="badge" :class="doctor.active ? 'bg-success' : 'bg-secondary'">
                                        {{ doctor.active ? 'Активен' : 'Неактивен' }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-1" @click="editDoctor(doctor)">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="deleteDoctor(doctor)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ПАГИНАЦИЯ -->
            <div v-if="totalPages > 1" class="card-footer bg-white py-3">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center mb-0">
                        <li class="page-item" :class="{ disabled: currentPage === 0 }">
                            <button class="page-link" @click="currentPage--">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                        </li>
                        <li class="page-item disabled">
                            <span class="page-link text-muted">
                                Страница {{ currentPage + 1 }} из {{ totalPages }}
                            </span>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                            <button class="page-link" @click="currentPage++">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Модальное окно (код скрыт для краткости, он стандартный) -->
        <div class="modal fade" id="doctorModal" tabindex="-1" ref="doctorModal">
             <!-- ... содержимое модалки такое же как раньше ... -->
             <div class="modal-dialog"><div class="modal-content"><div class="modal-body">Форма врача...</div></div></div>
        </div>
    </div>
    `,
    data() {
        return {
            doctors: [],
            departments: [],
            loading: false,
            currentPage: 0,
            pageSize: 20, // Всегда 20
            filters: { departmentId: null, active: null },
            modal: null,
            form: {}, // ... поля формы
            isEditing: false
        };
    },
    computed: {
        filteredDoctors() {
            let result = this.doctors;
            if (this.filters.departmentId) {
                const dept = this.departments.find(d => d.id === this.filters.departmentId);
                if (dept) result = result.filter(d => d.departmentName === dept.name);
            }
            if (this.filters.active !== null) {
                result = result.filter(d => d.active === this.filters.active);
            }
            return result;
        },
        totalPages() {
            return Math.ceil(this.filteredDoctors.length / this.pageSize);
        },
        paginatedDoctors() {
            const start = this.currentPage * this.pageSize;
            return this.filteredDoctors.slice(start, start + this.pageSize);
        }
    },
    async mounted() {
        // Инициализация модалки, если она есть в шаблоне
        if (this.$refs.doctorModal) this.modal = new bootstrap.Modal(this.$refs.doctorModal);

        this.loading = true;
        // Загружаем ВСЕХ для клиентской пагинации
        this.doctors = await API.doctors.getAll();
        this.departments = await API.departments.getAll();
        this.loading = false;
    },
    methods: {
        resetFilters() {
            this.filters = { departmentId: null, active: null };
            this.currentPage = 0;
        },
        openCreateModal() { /* ... */ },
        editDoctor(d) { /* ... */ },
        deleteDoctor(d) { /* ... */ }
    }
};
// ==================== ADMIN SERVICES ====================
const AdminServices = {
    template: `
    <div>
        <div v-if="success" class="alert alert-success alert-dismissible fade show">
            <i class="bi bi-check-circle me-2"></i> {{ success }}
            <button type="button" class="btn-close" @click="success = null"></button>
        </div>
        <div v-if="error" class="alert alert-danger alert-dismissible fade show">
            <i class="bi bi-exclamation-circle me-2"></i> {{ error }}
            <button type="button" class="btn-close" @click="error = null"></button>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Управление услугами</h4>
                <p class="text-muted mb-0">Всего: {{ totalItems }} услуг</p>
            </div>
            <button class="btn btn-primary" @click="openCreateModal">
                <i class="bi bi-plus-lg me-1"></i> Добавить услугу
            </button>
        </div>

        <!-- Фильтры -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label small text-muted">Отделение</label>
                        <select v-model="filters.departmentId" class="form-select" @change="applyFilters">
                            <option :value="null">Все отделения</option>
                            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                {{ dept.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6 d-flex align-items-end">
                        <button class="btn btn-outline-secondary" @click="resetFilters">
                            <i class="bi bi-x-circle me-1"></i> Сбросить
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <loading-spinner v-if="loading" message="Загрузка услуг..." />

        <div v-else class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Отделение</th>
                                <th class="text-end">Цена</th>
                                <th class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="service in paginatedServices" :key="service.id">
                                <td>{{ service.id }}</td>
                                <td><strong>{{ service.name }}</strong></td>
                                <td>
                                    <span class="text-muted">{{ truncate(service.description, 40) }}</span>
                                </td>
                                <td>
                                    <span class="badge bg-info-subtle text-info">
                                        {{ service.departmentName }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <strong class="text-primary">{{ formatPrice(service.price) }} ₽</strong>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-1"
                                            @click="editService(service)">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteService(service)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Пагинация -->
            <div v-if="totalPages > 1" class="card-footer bg-white d-flex justify-content-center">
                <nav>
                    <ul class="pagination mb-0">
                        <li class="page-item" :class="{ disabled: currentPage === 0 }">
                            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
                                <i class="bi bi-chevron-left"></i>
                            </a>
                        </li>
                        <li v-for="page in visiblePages" :key="page"
                            class="page-item" :class="{ active: page === currentPage }">
                            <a class="page-link" href="#" @click.prevent="goToPage(page)">
                                {{ page + 1 }}
                            </a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                            <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
                                <i class="bi bi-chevron-right"></i>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>

            <div v-if="filteredServices.length === 0 && !loading" class="card-body text-center py-5">
                <i class="bi bi-clipboard2-pulse display-1 text-muted"></i>
                <h5 class="mt-3">Услуги не найдены</h5>
            </div>
        </div>

        <!-- Модальное окно -->
        <div class="modal fade" id="serviceModal" tabindex="-1" ref="serviceModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <form @submit.prevent="saveService">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                {{ isEditing ? 'Редактирование услуги' : 'Новая услуга' }}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-8 mb-3">
                                    <label class="form-label">Название *</label>
                                    <input type="text" v-model="form.name" class="form-control" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Цена *</label>
                                    <div class="input-group">
                                        <input type="number" v-model="form.price" class="form-control"
                                               required min="0" step="0.01">
                                        <span class="input-group-text">₽</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Отделение *</label>
                                <select v-model="form.departmentId" class="form-select" required>
                                    <option :value="null">Выберите отделение</option>
                                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                        {{ dept.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Описание</label>
                                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="submit" class="btn btn-primary" :disabled="saving">
                                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                                {{ isEditing ? 'Сохранить' : 'Создать' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            services: [],
            loading: false,
            saving: false,
            success: null,
            error: null,
            isEditing: false,
            currentPage: 0,
            pageSize: 20,
            filters: { departmentId: null },
            form: { id: null, name: '', description: '', price: null, departmentId: null },
            modal: null
        };
    },

    computed: {
        departments() { return Store.state.departments; },

        filteredServices() {
            let result = [...this.services];

            if (this.filters.departmentId) {
                const dept = this.departments.find(d => d.id === this.filters.departmentId);
                if (dept) {
                    result = result.filter(s => s.departmentName === dept.name);
                }
            }

            return result;
        },

        totalItems() {
            return this.filteredServices.length;
        },

        totalPages() {
            return Math.ceil(this.filteredServices.length / this.pageSize);
        },

        paginatedServices() {
            const start = this.currentPage * this.pageSize;
            return this.filteredServices.slice(start, start + this.pageSize);
        },

        visiblePages() {
            const pages = [];
            const start = Math.max(0, this.currentPage - 2);
            const end = Math.min(this.totalPages - 1, this.currentPage + 2);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        }
    },

    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.serviceModal);
        this.loadServices();
    },

    methods: {
        async loadServices() {
            this.loading = true;
            try {
                this.services = await API.services.getAll();
            } catch (error) {
                this.error = 'Ошибка загрузки услуг';
            } finally {
                this.loading = false;
            }
        },

        applyFilters() {
            this.currentPage = 0;
        },

        resetFilters() {
            this.filters = { departmentId: null };
            this.currentPage = 0;
        },

        goToPage(page) {
            if (page >= 0 && page < this.totalPages) {
                this.currentPage = page;
            }
        },

        formatPrice(price) {
            return Store.formatPrice(price);
        },

        truncate(text, length) {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
        },

        openCreateModal() {
            this.isEditing = false;
            this.form = { id: null, name: '', description: '', price: null, departmentId: null };
            this.modal.show();
        },

        async editService(service) {
            this.isEditing = true;
            try {
                const data = await API.services.getById(service.id);
                this.form = {
                    id: data.id,
                    name: data.name,
                    description: data.description || '',
                    price: data.price,
                    departmentId: data.departmentId
                };
                this.modal.show();
            } catch (error) {
                this.error = 'Ошибка загрузки данных';
            }
        },

        async saveService() {
            this.saving = true;
            try {
                const data = {
                    name: this.form.name,
                    description: this.form.description,
                    price: this.form.price,
                    departmentId: this.form.departmentId
                };

                if (this.isEditing) {
                    await API.services.update(this.form.id, data);
                    this.success = 'Услуга обновлена';
                } else {
                    await API.services.create(data);
                    this.success = 'Услуга создана';
                }
                this.modal.hide();
                this.loadServices();
                Store.loadPublicData();
            } catch (error) {
                this.error = error.response?.data?.message || 'Ошибка сохранения';
            } finally {
                this.saving = false;
            }
        },

        async deleteService(service) {
            if (!confirm('Удалить услугу "' + service.name + '"?')) return;
            try {
                await API.services.delete(service.id);
                this.success = 'Услуга удалена';
                this.loadServices();
                Store.loadPublicData();
            } catch (error) {
                this.error = 'Ошибка удаления';
            }
        }
    }
};
// ==================== ADMIN DEPARTMENTS ====================
const AdminDepartments = {
    template: `
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Управление отделениями</h4>
                <p class="text-muted mb-0">Всего: {{ departments.length }} отделений</p>
            </div>
            <button class="btn btn-primary" @click="openCreateModal">
                <i class="bi bi-plus-lg me-1"></i> Добавить отделение
            </button>
        </div>

        <loading-spinner v-if="loading" message="Загрузка отделений..." />

        <div v-else class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Описание</th>
                                <th class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="dept in paginatedDepartments" :key="dept.id">
                                <td>{{ dept.id }}</td>
                                <td><strong>{{ dept.name }}</strong></td>
                                <td>{{ dept.description }}</td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-1" @click="editDepartment(dept)">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger" @click="deleteDepartment(dept)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ПАГИНАЦИЯ -->
            <div v-if="totalPages > 1" class="card-footer bg-white py-3">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center mb-0">
                        <li class="page-item" :class="{ disabled: currentPage === 0 }">
                            <button class="page-link" @click="currentPage--">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                        </li>
                        <li class="page-item disabled">
                            <span class="page-link text-muted">
                                Страница {{ currentPage + 1 }} из {{ totalPages }}
                            </span>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                            <button class="page-link" @click="currentPage++">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- Модалка скрыта для краткости -->
        <div class="modal fade" id="deptModal" tabindex="-1" ref="deptModal"><div class="modal-dialog"><div class="modal-content"></div></div></div>
    </div>
    `,
    data() {
        return {
            departments: [],
            loading: false,
            currentPage: 0,
            pageSize: 20,
            modal: null,
            form: { id: null, name: '', description: '' },
            isEditing: false
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.departments.length / this.pageSize);
        },
        paginatedDepartments() {
            const start = this.currentPage * this.pageSize;
            return this.departments.slice(start, start + this.pageSize);
        }
    },
    async mounted() {
        if (this.$refs.deptModal) this.modal = new bootstrap.Modal(this.$refs.deptModal);
        this.loading = true;
        this.departments = await API.departments.getAll();
        this.loading = false;
    },
    methods: {
        openCreateModal() {
            this.isEditing = false;
            this.form = {name:'', description:''};
            this.modal.show();
        },
        editDepartment(d) { /*...*/ },
        deleteDepartment(d) { /*...*/ },
        saveDepartment() { /*...*/ }
    }
};
// ==================== ADMIN APPOINTMENTS ====================
const AdminAppointments = {
    template: `
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Управление записями</h4>
                <p class="text-muted mb-0">Всего: {{ filteredAppointments.length }} записей</p>
            </div>
        </div>

        <!-- Фильтры -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-3">
                        <label class="form-label small text-muted">Статус</label>
                        <select v-model="filters.status" class="form-select" @change="currentPage = 0">
                            <option :value="null">Все статусы</option>
                            <option value="Запланирован">Запланирован</option>
                            <option value="Завершен">Завершен</option>
                            <option value="Отменен">Отменен</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label small text-muted">Врач</label>
                        <select v-model="filters.doctorId" class="form-select" @change="currentPage = 0">
                            <option :value="null">Все врачи</option>
                            <option v-for="doc in doctors" :key="doc.id" :value="doc.id">
                                {{ doc.fullName }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label small text-muted">Дата от</label>
                        <input type="date" v-model="filters.dateFrom" class="form-control" @change="currentPage = 0">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label small text-muted">Дата до</label>
                        <input type="date" v-model="filters.dateTo" class="form-control" @change="currentPage = 0">
                    </div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button class="btn btn-outline-secondary w-100" @click="resetFilters">
                            Сбросить
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <loading-spinner v-if="loading" message="Загрузка записей..." />

        <div v-else class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Пациент</th>
                                <th>Врач</th>
                                <th>Услуга</th>
                                <th>Дата</th>
                                <th>Статус</th>
                                <th class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Убрал getRowClass, теперь фон всегда белый -->
                            <tr v-for="app in paginatedAppointments" :key="app.id">
                                <td>{{ app.id }}</td>
                                <td>{{ app.patientName }}</td>
                                <td>{{ app.doctorName }}</td>
                                <td>{{ app.serviceName }}</td>
                                <td>{{ formatDate(app.appointmentDate) }}</td>
                                <td>
                                    <span class="badge" :class="getStatusClass(app.status)">
                                        {{ app.status }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-danger" @click="deleteAppointment(app)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ПАГИНАЦИЯ -->
            <div v-if="totalPages > 1" class="card-footer bg-white py-3">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center mb-0">
                        <li class="page-item" :class="{ disabled: currentPage === 0 }">
                            <button class="page-link" @click="currentPage--">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                        </li>
                        <li class="page-item disabled">
                            <span class="page-link text-muted">
                                Страница {{ currentPage + 1 }} из {{ totalPages }}
                            </span>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
                            <button class="page-link" @click="currentPage++">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div v-if="filteredAppointments.length === 0" class="p-5 text-center text-muted">
                Записи не найдены
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            appointments: [],
            doctors: [],
            loading: false,
            currentPage: 0,
            pageSize: 20, // Фиксированно 20
            filters: { status: null, doctorId: null, dateFrom: null, dateTo: null }
        };
    },
    computed: {
        filteredAppointments() {
            let result = this.appointments;

            if (this.filters.status) {
                result = result.filter(a => a.status === this.filters.status);
            }
            if (this.filters.doctorId) {
                const doc = this.doctors.find(d => d.id === this.filters.doctorId);
                // Сравнение по имени, так как в DTO записи только имя врача
                if (doc) result = result.filter(a => a.doctorName === doc.fullName);
            }
            // Фильтрация по дате
            if (this.filters.dateFrom) {
                const from = new Date(this.filters.dateFrom);
                from.setHours(0,0,0,0);
                result = result.filter(a => new Date(a.appointmentDate) >= from);
            }
            if (this.filters.dateTo) {
                const to = new Date(this.filters.dateTo);
                to.setHours(23,59,59,999);
                result = result.filter(a => new Date(a.appointmentDate) <= to);
            }

            return result;
        },
        totalPages() {
            return Math.ceil(this.filteredAppointments.length / this.pageSize);
        },
        paginatedAppointments() {
            const start = this.currentPage * this.pageSize;
            return this.filteredAppointments.slice(start, start + this.pageSize);
        }
    },
    async mounted() {
        this.loading = true;
        // Загружаем всё скопом для корректной фильтрации на клиенте
        const [apps, docs] = await Promise.all([
            API.appointments.getAll({ size: 10000 }), // Берем много
            API.doctors.getAll()
        ]);

        // Обработка формата ответа Spring Pageable или List
        this.appointments = Array.isArray(apps) ? apps : (apps.content || []);
        this.doctors = docs;

        this.loading = false;
    },
    methods: {
        resetFilters() {
            this.filters = { status: null, doctorId: null, dateFrom: null, dateTo: null };
            this.currentPage = 0;
        },
        formatDate(d) { return Store.formatDate(d); },
        getStatusClass(s) {
            if (s === 'Запланирован') return 'bg-primary';
            if (s === 'Завершен') return 'bg-success';
            if (s === 'Отменен') return 'bg-secondary'; // Серый вместо красного, чтобы не пестрило
            return 'bg-secondary';
        },
        deleteAppointment(a) {
            if(confirm('Удалить?')) {
                API.appointments.delete(a.id).then(() => {
                    this.appointments = this.appointments.filter(x => x.id !== a.id);
                });
            }
        }
    }
};