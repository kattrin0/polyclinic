// ============================================
// АДМИН-ПАНЕЛЬ - ПРОДОЛЖЕНИЕ
// ============================================

// ==================== ADMIN DOCTORS ====================
const AdminDoctors = {
    template: `
    <div>
        <!-- Уведомления -->
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
                <p class="text-muted mb-0">Всего: {{ doctors.length }} врачей</p>
            </div>
            <button class="btn btn-primary" @click="openCreateModal">
                <i class="bi bi-plus-lg me-1"></i> Добавить врача
            </button>
        </div>

        <!-- Загрузка -->
        <loading-spinner v-if="loading" message="Загрузка врачей..." />

        <!-- Таблица врачей -->
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
                                <td>{{ doctor.fullName }}</td>
                                <td>{{ doctor.specialization }}</td>
                                <td>
                                    <span class="badge bg-info-subtle text-info">
                                        {{ doctor.departmentName }}
                                    </span>
                                </td>
                                <td>
                                    <span :class="doctor.active ? 'badge bg-success' : 'badge bg-secondary'">
                                        {{ doctor.active ? 'Активен' : 'Неактивен' }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-1"
                                            @click="editDoctor(doctor)" title="Редактировать">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning me-1"
                                            @click="toggleActive(doctor)" title="Сменить статус">
                                        <i class="bi bi-arrow-repeat"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteDoctor(doctor)" title="Удалить">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Пустое состояние -->
            <div v-if="doctors.length === 0" class="card-body text-center py-5">
                <i class="bi bi-person-x display-1 text-muted"></i>
                <h5 class="mt-3">Врачи не найдены</h5>
                <p class="text-muted">Добавьте первого врача</p>
                <button class="btn btn-primary" @click="openCreateModal">
                    <i class="bi bi-plus-lg me-1"></i> Добавить врача
                </button>
            </div>
        </div>

        <!-- Модальное окно создания/редактирования -->
        <div class="modal fade" id="doctorModal" tabindex="-1" ref="doctorModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <form @submit.prevent="saveDoctor">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i :class="isEditing ? 'bi bi-pencil' : 'bi bi-person-plus'" class="me-2"></i>
                                {{ isEditing ? 'Редактирование врача' : 'Добавление врача' }}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">ФИО <span class="text-danger">*</span></label>
                                    <input type="text" v-model="form.fullName" class="form-control"
                                           placeholder="Иванов Иван Иванович" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email <span class="text-danger">*</span></label>
                                    <input type="email" v-model="form.email" class="form-control"
                                           placeholder="doctor@medcenter.ru" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Телефон</label>
                                    <input type="tel" v-model="form.phone" class="form-control"
                                           placeholder="+7 (999) 123-45-67">
                                </div>
                                <div class="col-md-6 mb-3" v-if="!isEditing">
                                    <label class="form-label">Пароль <span class="text-danger">*</span></label>
                                    <input type="password" v-model="form.password" class="form-control"
                                           placeholder="Минимум 6 символов" :required="!isEditing" minlength="6">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Специализация <span class="text-danger">*</span></label>
                                    <input type="text" v-model="form.specialization" class="form-control"
                                           placeholder="Терапевт, Кардиолог и т.д." required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Отделение <span class="text-danger">*</span></label>
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
                                        <input class="form-check-input" type="checkbox" v-model="form.active" id="doctorActive">
                                        <label class="form-check-label" for="doctorActive">
                                            Активен (принимает пациентов)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="submit" class="btn btn-primary" :disabled="saving">
                                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                                <i v-else class="bi bi-check-lg me-1"></i>
                                {{ isEditing ? 'Сохранить' : 'Добавить' }}
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
            form: this.getEmptyForm(),
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
        getEmptyForm() {
            return {
                id: null,
                fullName: '',
                email: '',
                phone: '',
                password: '',
                specialization: '',
                departmentId: null,
                active: true
            };
        },

        async loadDoctors() {
            this.loading = true;
            try {
                this.doctors = await API.doctors.getAll();
            } catch (error) {
                console.error('Load doctors error:', error);
                this.error = 'Ошибка загрузки врачей';
            } finally {
                this.loading = false;
            }
        },

        openCreateModal() {
            this.isEditing = false;
            this.form = this.getEmptyForm();
            this.modal.show();
        },

        editDoctor(doctor) {
            this.isEditing = true;
            this.form = {
                id: doctor.id,
                fullName: doctor.fullName,
                email: doctor.email || '',
                phone: doctor.phone || '',
                password: '',
                specialization: doctor.specialization,
                departmentId: this.getDepartmentIdByName(doctor.departmentName),
                active: doctor.active
            };
            this.modal.show();
        },

        getDepartmentIdByName(name) {
            const dept = this.departments.find(d => d.name === name);
            return dept ? dept.id : null;
        },

        async saveDoctor() {
            this.saving = true;
            try {
                if (this.isEditing) {
                    await API.doctors.update(this.form.id, this.form);
                    this.success = 'Врач успешно обновлён';
                } else {
                    await API.doctors.create(this.form);
                    this.success = 'Врач успешно добавлен';
                }
                this.modal.hide();
                this.loadDoctors();
                // Обновляем глобальные данные
                Store.loadPublicData();
            } catch (error) {
                console.error('Save doctor error:', error);
                this.error = error.response?.data?.message || 'Ошибка сохранения';
            } finally {
                this.saving = false;
            }
        },

        async toggleActive(doctor) {
            try {
                await API.doctors.toggleActive(doctor.id);
                doctor.active = !doctor.active;
                this.success = 'Статус врача изменён';
            } catch (error) {
                console.error('Toggle active error:', error);
                this.error = 'Ошибка изменения статуса';
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
                console.error('Delete doctor error:', error);
                this.error = 'Ошибка удаления врача';
            }
        }
    }
};

// ==================== ADMIN SERVICES ====================
const AdminServices = {
    template: `
    <div>
        <!-- Уведомления -->
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
                <p class="text-muted mb-0">Всего: {{ services.length }} услуг</p>
            </div>
            <button class="btn btn-primary" @click="openCreateModal">
                <i class="bi bi-plus-lg me-1"></i> Добавить услугу
            </button>
        </div>

        <!-- Загрузка -->
        <loading-spinner v-if="loading" message="Загрузка услуг..." />

        <!-- Таблица услуг -->
        <div v-else class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Отделение</th>
                                <th>Описание</th>
                                <th>Цена</th>
                                <th class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="service in services" :key="service.id">
                                <td>{{ service.id }}</td>
                                <td>{{ service.name }}</td>
                                <td>
                                    <span class="badge bg-info-subtle text-info">
                                        {{ service.departmentName }}
                                    </span>
                                </td>
                                <td>
                                    <span class="text-muted">{{ truncate(service.description, 40) }}</span>
                                </td>
                                <td>
                                    <strong class="text-primary">{{ formatPrice(service.price) }} ₽</strong>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-1"
                                            @click="editService(service)" title="Редактировать">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteService(service)" title="Удалить">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Модальное окно -->
        <div class="modal fade" id="serviceModal" tabindex="-1" ref="serviceModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form @submit.prevent="saveService">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i :class="isEditing ? 'bi bi-pencil' : 'bi bi-plus-lg'" class="me-2"></i>
                                {{ isEditing ? 'Редактирование услуги' : 'Новая услуга' }}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Название</label>
                                <input type="text" v-model="form.name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Описание</label>
                                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Цена (₽)</label>
                                <input type="number" v-model="form.price" class="form-control"
                                       step="0.01" min="0" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Отделение</label>
                                <select v-model="form.departmentId" class="form-select" required>
                                    <option :value="null">Выберите отделение</option>
                                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                        {{ dept.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="submit" class="btn btn-primary" :disabled="saving">
                                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                                <i v-else class="bi bi-check-lg me-1"></i>
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
            form: this.getEmptyForm(),
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
        getEmptyForm() {
            return { id: null, name: '', description: '', price: 0, departmentId: null };
        },

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

        openCreateModal() {
            this.isEditing = false;
            this.form = this.getEmptyForm();
            this.modal.show();
        },

        editService(service) {
            this.isEditing = true;
            const dept = this.departments.find(d => d.name === service.departmentName);
            this.form = {
                id: service.id,
                name: service.name,
                description: service.description || '',
                price: service.price,
                departmentId: dept ? dept.id : null
            };
            this.modal.show();
        },

        async saveService() {
            this.saving = true;
            try {
                if (this.isEditing) {
                    await API.services.update(this.form.id, this.form);
                    this.success = 'Услуга успешно обновлена';
                } else {
                    await API.services.create(this.form);
                    this.success = 'Услуга успешно создана';
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
                this.error = 'Ошибка удаления услуги';
            }
        },

        formatPrice(price) { return Store.formatPrice(price); },
        truncate(text, length) {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
        }
    }
};

// ==================== ADMIN DEPARTMENTS ====================
const AdminDepartments = {
    template: `
    <div>
        <!-- Уведомления -->
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

        <!-- Загрузка -->
        <loading-spinner v-if="loading" message="Загрузка отделений..." />

        <!-- Таблица -->
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
                            <tr v-for="dept in departments" :key="dept.id">
                                <td>{{ dept.id }}</td>
                                <td>
                                    <strong>{{ dept.name }}</strong>
                                    <span class="ms-2">{{ getDepartmentIcon(dept.name) }}</span>
                                </td>
                                <td>
                                    <span class="text-muted">{{ truncate(dept.description, 60) }}</span>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-1"
                                            @click="editDepartment(dept)" title="Редактировать">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteDepartment(dept)" title="Удалить">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Модальное окно -->
        <div class="modal fade" id="deptModal" tabindex="-1" ref="deptModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form @submit.prevent="saveDepartment">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i :class="isEditing ? 'bi bi-pencil' : 'bi bi-plus-lg'" class="me-2"></i>
                                {{ isEditing ? 'Редактирование отделения' : 'Новое отделение' }}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Название</label>
                                <input type="text" v-model="form.name" class="form-control" required>
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
                                <i v-else class="bi bi-check-lg me-1"></i>
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

        openCreateModal() {
            this.isEditing = false;
            this.form = { id: null, name: '', description: '' };
            this.modal.show();
        },

        editDepartment(dept) {
            this.isEditing = true;
            this.form = { id: dept.id, name: dept.name, description: dept.description || '' };
            this.modal.show();
        },

        async saveDepartment() {
            this.saving = true;
            try {
                if (this.isEditing) {
                    await API.departments.update(this.form.id, this.form);
                    this.success = 'Отделение успешно обновлено';
                } else {
                    await API.departments.create(this.form);
                    this.success = 'Отделение успешно создано';
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
            if (!confirm(`Удалить отделение "${dept.name}"? Это может повлиять на связанные услуги и врачей.`)) return;

            try {
                await API.departments.delete(dept.id);
                this.success = 'Отделение удалено';
                this.loadDepartments();
                Store.loadPublicData();
            } catch (error) {
                this.error = 'Ошибка удаления отделения';
            }
        },

        getDepartmentIcon(name) { return Store.getDepartmentIcon(name); },
        truncate(text, length) {
            if (!text) return '';
            return text.length > length ? text.substring(0, length) + '...' : text;
        }
    }
};

// ==================== ADMIN APPOINTMENTS ====================
const AdminAppointments = {
    template: `
    <div>
        <!-- Уведомления -->
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

        <!-- Загрузка -->
        <loading-spinner v-if="loading" message="Загрузка записей..." />

        <!-- Таблица записей -->
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
                                <th>Цена</th>
                                <th class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="app in appointments" :key="app.id">
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
                                <td>
                                    <strong class="text-primary">
                                        {{ app.price ? formatPrice(app.price) + ' ₽' : '-' }}
                                    </strong>
                                </td>
                                <td class="text-end">
                                    <div class="dropdown d-inline">
                                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle"
                                                type="button" data-bs-toggle="dropdown">
                                            Статус
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li v-for="status in statuses" :key="status.value">
                                                <a class="dropdown-item" href="#"
                                                   @click.prevent="updateStatus(app, status.value)">
                                                    <i :class="status.icon" class="me-2"></i>
                                                    {{ status.label }}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <button class="btn btn-sm btn-outline-danger ms-1"
                                            @click="deleteAppointment(app)" title="Удалить">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Пагинация -->
            <div v-if="totalPages > 1" class="card-footer bg-white">
                <pagination-component
                    :current-page="currentPage"
                    :total-pages="totalPages"
                    @page-change="loadAppointments"
                />
            </div>

            <!-- Пустое состояние -->
            <div v-if="appointments.length === 0" class="card-body text-center py-5">
                <i class="bi bi-calendar-x display-1 text-muted"></i>
                <h5 class="mt-3">Записей пока нет</h5>
                <p class="text-muted">Записи на приём появятся здесь</p>
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
            statuses: [
                { value: 'Запланирован', label: 'Запланирован', icon: 'bi bi-clock text-primary' },
                { value: 'Завершен', label: 'Завершен', icon: 'bi bi-check-circle text-success' },
                { value: 'Перенесен', label: 'Перенесен', icon: 'bi bi-arrow-repeat text-warning' },
                { value: 'Отменен', label: 'Отменен', icon: 'bi bi-x-circle text-danger' }
            ]
        };
    },

    mounted() {
        this.loadAppointments(0);
    },

    methods: {
        async loadAppointments(page = 0) {
            this.loading = true;
            try {
                const response = await API.appointments.getAll(page);
                this.appointments = response.content || response;
                this.currentPage = response.number || 0;
                this.totalPages = response.totalPages || 1;
                this.totalItems = response.totalElements || this.appointments.length;
            } catch (error) {
                this.error = 'Ошибка загрузки записей';
            } finally {
                this.loading = false;
            }
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
            if (!confirm('Удалить запись?')) return;

            try {
                await API.appointments.delete(appointment.id);
                this.success = 'Запись удалена';
                this.loadAppointments(this.currentPage);
            } catch (error) {
                this.error = 'Ошибка удаления записи';
            }
        },

        formatDate(date) { return Store.formatDate(date); },
        formatPrice(price) { return Store.formatPrice(price); },

        getStatusClass(status) {
            const classes = {
                'Запланирован': 'bg-primary',
                'Завершен': 'bg-success',
                'Отменен': 'bg-danger',
                'Перенесен': 'bg-warning text-dark'
            };
            return classes[status] || 'bg-secondary';
        }
    }
};