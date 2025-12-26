// ============================================
// АДМИН-ПАНЕЛЬ - ПРОДОЛЖЕНИЕ
// ============================================
// ==================== ADMIN DOCTORS ====================
const AdminDoctors = {
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
                <h4 class="mb-1">Управление врачами</h4>
                <p class="text-muted mb-0">Всего: {{ totalItems }} врачей</p>
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
                        <select v-model="filters.departmentId" class="form-select" @change="applyFilters">
                            <option :value="null">Все отделения</option>
                            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                {{ dept.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Статус</label>
                        <select v-model="filters.active" class="form-select" @change="applyFilters">
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
                            <tr v-for="doctor in doctors" :key="doctor.id">
                                <td>{{ doctor.id }}</td>
                                <td><strong>{{ doctor.fullName }}</strong></td>
                                <td>{{ doctor.specialization }}</td>
                                <td>
                                    <span class="badge bg-info-subtle text-info">
                                        {{ doctor.departmentName }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge" :class="doctor.active ? 'bg-success' : 'bg-secondary'">
                                        {{ doctor.active ? 'Активен' : 'Неактивен' }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-1"
                                            @click="editDoctor(doctor)">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm me-1"
                                            :class="doctor.active ? 'btn-outline-warning' : 'btn-outline-success'"
                                            @click="toggleActive(doctor)">
                                        <i :class="doctor.active ? 'bi bi-pause' : 'bi bi-play'"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteDoctor(doctor)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="totalPages > 1" class="card-footer bg-white">
                <pagination-component
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    @page-change="goToPage"
                />
            </div>

            <div v-if="doctors.length === 0 && !loading" class="card-body text-center py-5">
                <i class="bi bi-person-badge display-1 text-muted"></i>
                <h5 class="mt-3">Врачи не найдены</h5>
            </div>
        </div>

        <!-- Модальное окно -->
        <div class="modal fade" id="doctorModal" tabindex="-1" ref="doctorModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <form @submit.prevent="saveDoctor">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                {{ isEditing ? 'Редактирование врача' : 'Новый врач' }}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">ФИО *</label>
                                    <input type="text" v-model="form.fullName" class="form-control" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Специализация *</label>
                                    <input type="text" v-model="form.specialization" class="form-control" required>
                                </div>
                            </div>
                            <div class="row" v-if="!isEditing">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email *</label>
                                    <input type="email" v-model="form.email" class="form-control" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Телефон</label>
                                    <input type="tel" v-model="form.phone" class="form-control">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Пароль *</label>
                                    <input type="password" v-model="form.password" class="form-control" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Отделение *</label>
                                    <select v-model="form.departmentId" class="form-select" required>
                                        <option :value="null">Выберите отделение</option>
                                        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                            {{ dept.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3" v-if="isEditing">
                                    <label class="form-label">Статус</label>
                                    <div class="form-check form-switch mt-2">
                                        <input class="form-check-input" type="checkbox" v-model="form.isActive">
                                        <label class="form-check-label">{{ form.isActive ? 'Активен' : 'Неактивен' }}</label>
                                    </div>
                                </div>
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
            doctors: [],
            loading: false,
            saving: false,
            success: null,
            error: null,
            isEditing: false,
            currentPage: 0,
            totalPages: 0,
            totalItems: 0,
            filters: { departmentId: null, active: null },
            form: { id: null, fullName: '', email: '', phone: '', password: '', specialization: '', departmentId: null, isActive: true },
            modal: null
        };
    },

    computed: {
        departments() { return Store.state.departments; }
    },

    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.doctorModal);
        this.loadDoctors();
    },

    methods: {
        async loadDoctors() {
            this.loading = true;
            try {
                const response = await API.doctors.getAllPaginated({
                    page: this.currentPage,
                    departmentId: this.filters.departmentId,
                    active: this.filters.active
                });
                this.doctors = response.content || [];
                this.currentPage = response.number || 0;
                this.totalPages = response.totalPages || 1;
                this.totalItems = response.totalElements || 0;
            } catch (error) {
                this.error = 'Ошибка загрузки врачей';
            } finally {
                this.loading = false;
            }
        },

        applyFilters() {
            this.currentPage = 0;
            this.loadDoctors();
        },

        resetFilters() {
            this.filters = { departmentId: null, active: null };
            this.currentPage = 0;
            this.loadDoctors();
        },

        goToPage(page) {
            this.currentPage = page;
            this.loadDoctors();
        },

        openCreateModal() {
            this.isEditing = false;
            this.form = { id: null, fullName: '', email: '', phone: '', password: '', specialization: '', departmentId: null, isActive: true };
            this.modal.show();
        },

        async editDoctor(doctor) {
            this.isEditing = true;
            try {
                const data = await API.doctors.getById(doctor.id);
                this.form = {
                    id: data.id,
                    fullName: data.fullName,
                    specialization: data.specialization,
                    departmentId: data.departmentId,
                    isActive: data.isActive
                };
                this.modal.show();
            } catch (error) {
                this.error = 'Ошибка загрузки данных';
            }
        },

        async saveDoctor() {
            this.saving = true;
            try {
                if (this.isEditing) {
                    await API.doctors.update(this.form.id, {
                        fullName: this.form.fullName,
                        specialization: this.form.specialization,
                        departmentId: this.form.departmentId,
                        isActive: this.form.isActive
                    });
                    this.success = 'Врач обновлён';
                } else {
                    await API.doctors.create(this.form);
                    this.success = 'Врач добавлен';
                }
                this.modal.hide();
                this.loadDoctors();
                Store.loadPublicData();
            } catch (error) {
                this.error = error.response?.data?.message || 'Ошибка сохранения';
            } finally {
                this.saving = false;
            }
        },

        async toggleActive(doctor) {
            try {
                await API.doctors.toggleActive(doctor.id);
                doctor.active = !doctor.active;
                this.success = 'Статус изменён';
            } catch (error) {
                this.error = 'Ошибка';
            }
        },

        async deleteDoctor(doctor) {
            if (!confirm(`Удалить врача "${doctor.fullName}"?`)) return;
            try {
                await API.doctors.delete(doctor.id);
                this.success = 'Врач удалён';
                this.loadDoctors();
                Store.loadPublicData();
            } catch (error) {
                this.error = 'Ошибка удаления';
            }
        }
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
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Отделение</label>
                        <select v-model="filters.departmentId" class="form-select" @change="applyFilters">
                            <option :value="null">Все отделения</option>
                            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                {{ dept.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Сортировка</label>
                        <select v-model="sortBy" class="form-select" @change="applyFilters">
                            <option value="id">По ID</option>
                            <option value="name">По названию</option>
                            <option value="price">По цене</option>
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
                            <tr v-for="service in services" :key="service.id">
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

            <div v-if="totalPages > 1" class="card-footer bg-white">
                <pagination-component
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    @page-change="goToPage"
                />
            </div>

            <div v-if="services.length === 0 && !loading" class="card-body text-center py-5">
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
            totalPages: 0,
            totalItems: 0,
            filters: { departmentId: null },
            sortBy: 'id',
            form: { id: null, name: '', description: '', price: null, departmentId: null },
            modal: null
        };
    },

    computed: {
        departments() { return Store.state.departments; }
    },

    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.serviceModal);
        this.loadServices();
    },

    methods: {
        async loadServices() {
            this.loading = true;
            try {
                const response = await API.services.getAllPaginated({
                    page: this.currentPage,
                    departmentId: this.filters.departmentId,
                    sortBy: this.sortBy
                });
                this.services = response.content || [];
                this.currentPage = response.number || 0;
                this.totalPages = response.totalPages || 1;
                this.totalItems = response.totalElements || 0;
            } catch (error) {
                this.error = 'Ошибка загрузки услуг';
            } finally {
                this.loading = false;
            }
        },

        applyFilters() {
            this.currentPage = 0;
            this.loadServices();
        },

        resetFilters() {
            this.filters = { departmentId: null };
            this.sortBy = 'id';
            this.currentPage = 0;
            this.loadServices();
        },

        goToPage(page) {
            this.currentPage = page;
            this.loadServices();
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
            if (!confirm(`Удалить услугу "${service.name}"?`)) return;
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
                                <th class="text-center">Врачей</th>
                                <th class="text-center">Услуг</th>
                                <th class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="dept in departments" :key="dept.id">
                                <td>{{ dept.id }}</td>
                                <td>
                                    <span class="me-2">{{ getDepartmentIcon(dept.name) }}</span>
                                    <strong>{{ dept.name }}</strong>
                                </td>
                                <td>
                                    <span class="text-muted">{{ truncate(dept.description, 50) }}</span>
                                </td>
                                <td class="text-center">
                                    <span class="badge bg-primary">{{ getDoctorsCount(dept.name) }}</span>
                                </td>
                                <td class="text-center">
                                    <span class="badge bg-info">{{ getServicesCount(dept.name) }}</span>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-1"
                                            @click="editDepartment(dept)">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteDepartment(dept)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="departments.length === 0 && !loading" class="card-body text-center py-5">
                <i class="bi bi-building display-1 text-muted"></i>
                <h5 class="mt-3">Отделения не найдены</h5>
            </div>
        </div>

        <!-- Модальное окно -->
        <div class="modal fade" id="deptModal" tabindex="-1" ref="deptModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form @submit.prevent="saveDepartment">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                {{ isEditing ? 'Редактирование отделения' : 'Новое отделение' }}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Название *</label>
                                <input type="text" v-model="form.name" class="form-control" required>
                                <div class="form-text">
                                    Иконка: {{ getDepartmentIcon(form.name) || '🏥' }}
                                </div>
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
            departments: [],
            loading: false,
            saving: false,
            success: null,
            error: null,
            isEditing: false,
            form: { id: null, name: '', description: '' },
            modal: null
        };
    },

    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.deptModal);
        this.loadDepartments();
    },

    methods: {
        async loadDepartments() {
            this.loading = true;
            try {
                this.departments = await API.departments.getAll();
            } catch (error) {
                this.error = 'Ошибка загрузки отделений';
            } finally {
                this.loading = false;
            }
        },

        getDepartmentIcon(name) {
            return Store.getDepartmentIcon(name);
        },

        getDoctorsCount(deptName) {
            return Store.state.doctors.filter(d => d.departmentName === deptName).length;
        },

        getServicesCount(deptName) {
            return Store.state.services.filter(s => s.departmentName === deptName).length;
        },

        truncate(text, length) {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
        },

        openCreateModal() {
            this.isEditing = false;
            this.form = { id: null, name: '', description: '' };
            this.modal.show();
        },

        editDepartment(dept) {
            this.isEditing = true;
            this.form = {
                id: dept.id,
                name: dept.name,
                description: dept.description || ''
            };
            this.modal.show();
        },

        async saveDepartment() {
            this.saving = true;
            try {
                if (this.isEditing) {
                    await API.departments.update(this.form.id, {
                        name: this.form.name,
                        description: this.form.description
                    });
                    this.success = 'Отделение обновлено';
                } else {
                    await API.departments.create({
                        name: this.form.name,
                        description: this.form.description
                    });
                    this.success = 'Отделение создано';
                }
                this.modal.hide();
                this.loadDepartments();
                Store.loadPublicData();
            } catch (error) {
                this.error = error.response?.data?.message || 'Ошибка сохранения';
            } finally {
                this.saving = false;
            }
        },

        async deleteDepartment(dept) {
            const doctorsCount = this.getDoctorsCount(dept.name);
            const servicesCount = this.getServicesCount(dept.name);

            let message = `Удалить отделение "${dept.name}"?`;
            if (doctorsCount > 0 || servicesCount > 0) {
                message += `\n\nВ этом отделении: ${doctorsCount} врачей, ${servicesCount} услуг.`;
            }

            if (!confirm(message)) return;

            try {
                await API.departments.delete(dept.id);
                this.success = 'Отделение удалено';
                this.loadDepartments();
                Store.loadPublicData();
            } catch (error) {
                this.error = error.response?.data?.message || 'Ошибка удаления';
            }
        }
    }
};
// ==================== ADMIN APPOINTMENTS ====================
const AdminAppointments = {
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
                <h4 class="mb-1">Управление записями</h4>
                <p class="text-muted mb-0">Всего: {{ totalItems }} записей</p>
            </div>
        </div>

        <!-- Фильтры -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Статус</label>
                        <select v-model="filters.status" class="form-select" @change="applyFilters">
                            <option :value="null">Все статусы</option>
                            <option v-for="status in statuses" :key="status.value" :value="status.value">
                                {{ status.label }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Врач</label>
                        <select v-model="filters.doctorId" class="form-select" @change="applyFilters">
                            <option :value="null">Все врачи</option>
                            <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                                {{ doctor.fullName }}
                            </option>
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
                                <th>Дата и время</th>
                                <th>Статус</th>
                                <th class="text-end">Цена</th>
                                <th class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="app in appointments" :key="app.id" :class="getRowClass(app.status)">
                                <td>{{ app.id }}</td>
                                <td><strong>{{ app.patientName }}</strong></td>
                                <td>{{ app.doctorName }}</td>
                                <td>{{ truncate(app.serviceName, 25) }}</td>
                                <td>{{ formatDate(app.appointmentDate) }}</td>
                                <td>
                                    <span class="badge" :class="getStatusClass(app.status)">
                                        {{ app.status }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <strong class="text-primary">
                                        {{ app.price ? formatPrice(app.price) + ' ₽' : '—' }}
                                    </strong>
                                </td>
                                <td class="text-end">
                                    <div class="dropdown d-inline">
                                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle"
                                                type="button" data-bs-toggle="dropdown">
                                            Статус
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <li v-for="status in statuses" :key="status.value">
                                                <a class="dropdown-item" href="#"
                                                   :class="{ 'active': app.status === status.value }"
                                                   @click.prevent="updateStatus(app, status.value)">
                                                    {{ status.label }}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <button class="btn btn-sm btn-outline-danger ms-1"
                                            @click="deleteAppointment(app)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="totalPages > 1" class="card-footer bg-white">
                <pagination-component
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    @page-change="goToPage"
                />
            </div>

            <div v-if="appointments.length === 0 && !loading" class="card-body text-center py-5">
                <i class="bi bi-calendar-x display-1 text-muted"></i>
                <h5 class="mt-3">Записи не найдены</h5>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            appointments: [],
            loading: false,
            success: null,
            error: null,
            currentPage: 0,
            totalPages: 0,
            totalItems: 0,
            filters: { status: null, doctorId: null },
            statuses: [
                { value: 'Запланирован', label: 'Запланирован' },
                { value: 'Завершен', label: 'Завершен' },
                { value: 'Перенесен', label: 'Перенесен' },
                { value: 'Отменен', label: 'Отменен' }
            ]
        };
    },

    computed: {
        doctors() { return Store.state.doctors; }
    },

    mounted() {
        this.loadAppointments();
    },

    methods: {
        async loadAppointments() {
            this.loading = true;
            try {
                const response = await API.appointments.getAll({
                    page: this.currentPage,
                    status: this.filters.status,
                    doctorId: this.filters.doctorId
                });
                this.appointments = response.content || [];
                this.currentPage = response.number || 0;
                this.totalPages = response.totalPages || 1;
                this.totalItems = response.totalElements || 0;
            } catch (error) {
                this.error = 'Ошибка загрузки записей';
            } finally {
                this.loading = false;
            }
        },

        applyFilters() {
            this.currentPage = 0;
            this.loadAppointments();
        },

        resetFilters() {
            this.filters = { status: null, doctorId: null };
            this.currentPage = 0;
            this.loadAppointments();
        },

        goToPage(page) {
            this.currentPage = page;
            this.loadAppointments();
        },

        formatDate(date) {
            return Store.formatDate(date);
        },

        formatPrice(price) {
            return Store.formatPrice(price);
        },

        truncate(text, length) {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
        },

        getStatusClass(status) {
            const classes = {
                'Запланирован': 'bg-primary',
                'Завершен': 'bg-success',
                'Отменен': 'bg-danger',
                'Перенесен': 'bg-warning text-dark'
            };
            return classes[status] || 'bg-secondary';
        },

        getRowClass(status) {
            if (status === 'Отменен') return 'table-danger';
            if (status === 'Завершен') return 'table-success';
            return '';
        },

        async updateStatus(appointment, status) {
            try {
                await API.appointments.updateStatus(appointment.id, status);
                appointment.status = status;
                this.success = 'Статус обновлён';
            } catch (error) {
                this.error = 'Ошибка обновления статуса';
            }
        },

        async deleteAppointment(appointment) {
            if (!confirm(`Удалить запись #${appointment.id}?`)) return;

            try {
                await API.appointments.delete(appointment.id);
                this.success = 'Запись удалена';
                this.loadAppointments();
            } catch (error) {
                this.error = 'Ошибка удаления записи';
            }
        }
    }
};