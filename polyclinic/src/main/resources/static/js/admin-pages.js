// ============================================
// АДМИН-ПАНЕЛЬ - КОМПОНЕНТЫ И СТРАНИЦЫ
// ============================================

// ==================== ADMIN LAYOUT ====================
const AdminLayout = {
    template: `
    <div class="container-fluid">
        <div class="row">
            <!-- Сайдбар -->
            <div class="col-md-3 col-lg-2 px-0">
                <admin-sidebar :active-page="activePage" />
            </div>

            <!-- Основной контент -->
            <div class="col-md-9 col-lg-10 py-4 px-4">
                <router-view></router-view>
            </div>
        </div>
    </div>
    `,

    computed: {
        activePage() {
            const path = this.$route.path;
            if (path === '/admin') return 'dashboard';
            if (path.includes('/admin/users')) return 'users';
            if (path.includes('/admin/doctors')) return 'doctors';
            if (path.includes('/admin/services')) return 'services';
            if (path.includes('/admin/departments')) return 'departments';
            if (path.includes('/admin/appointments')) return 'appointments';
            return 'dashboard';
        }
    }
};

// ==================== ADMIN SIDEBAR ====================
const AdminSidebar = {
    template: `
    <div class="admin-sidebar">
        <div class="text-center text-white mb-4">
            <i class="bi bi-hospital fs-1"></i>
            <h5 class="mt-2">МедЦентр+</h5>
            <small class="opacity-75">Админ-панель</small>
        </div>
        <nav class="nav flex-column">
            <router-link class="nav-link" :class="{ active: activePage === 'dashboard' }" to="/admin">
                <i class="bi bi-speedometer2 me-2"></i> Дашборд
            </router-link>
            <router-link class="nav-link" :class="{ active: activePage === 'users' }" to="/admin/users">
                <i class="bi bi-people me-2"></i> Пользователи
            </router-link>
            <router-link class="nav-link" :class="{ active: activePage === 'doctors' }" to="/admin/doctors">
                <i class="bi bi-person-badge me-2"></i> Врачи
            </router-link>
            <router-link class="nav-link" :class="{ active: activePage === 'services' }" to="/admin/services">
                <i class="bi bi-clipboard2-pulse me-2"></i> Услуги
            </router-link>
            <router-link class="nav-link" :class="{ active: activePage === 'departments' }" to="/admin/departments">
                <i class="bi bi-building me-2"></i> Отделения
            </router-link>
            <router-link class="nav-link" :class="{ active: activePage === 'appointments' }" to="/admin/appointments">
                <i class="bi bi-calendar-check me-2"></i> Записи
            </router-link>
            <hr class="border-light my-3">
            <router-link class="nav-link" to="/">
                <i class="bi bi-house me-2"></i> На сайт
            </router-link>
            <a class="nav-link" href="#" @click.prevent="logout">
                <i class="bi bi-box-arrow-left me-2"></i> Выход
            </a>
        </nav>
    </div>
    `,

    props: {
        activePage: {
            type: String,
            default: 'dashboard'
        }
    },

    methods: {
        async logout() {
            try {
                await API.auth.logout();
            } catch (e) {}
            Store.logout();
            this.$router.push('/');
        }
    }
};

// ==================== ADMIN DASHBOARD ====================
const AdminDashboard = {
    template: `
    <div>
        <!-- Заголовок -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="mb-1">Добро пожаловать, {{ user?.fullName }}!</h4>
                <p class="text-muted mb-0">Панель управления поликлиникой</p>
            </div>
            <div class="d-flex align-items-center gap-3">
                <span class="badge bg-success"><i class="bi bi-circle-fill me-1"></i> Онлайн</span>
            </div>
        </div>

        <!-- Загрузка -->
        <loading-spinner v-if="loading" message="Загрузка статистики..." />

        <!-- Статистика -->
        <div v-else class="row g-4">
            <div class="col-md-6 col-lg-4 col-xl">
                <div class="card stat-card h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="stat-icon bg-primary-subtle text-primary me-3">
                            <i class="bi bi-people"></i>
                        </div>
                        <div>
                            <h3 class="mb-0">{{ stats.usersCount || 0 }}</h3>
                            <small class="text-muted">Пользователей</small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 pt-0">
                        <router-link to="/admin/users" class="btn btn-sm btn-outline-primary w-100">
                            Управление <i class="bi bi-arrow-right"></i>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4 col-xl">
                <div class="card stat-card h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="stat-icon bg-success-subtle text-success me-3">
                            <i class="bi bi-person-badge"></i>
                        </div>
                        <div>
                            <h3 class="mb-0">{{ stats.doctorsCount || 0 }}</h3>
                            <small class="text-muted">Врачей</small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 pt-0">
                        <router-link to="/admin/doctors" class="btn btn-sm btn-outline-success w-100">
                            Управление <i class="bi bi-arrow-right"></i>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4 col-xl">
                <div class="card stat-card h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="stat-icon bg-info-subtle text-info me-3">
                            <i class="bi bi-clipboard2-pulse"></i>
                        </div>
                        <div>
                            <h3 class="mb-0">{{ stats.servicesCount || 0 }}</h3>
                            <small class="text-muted">Услуг</small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 pt-0">
                        <router-link to="/admin/services" class="btn btn-sm btn-outline-info w-100">
                            Управление <i class="bi bi-arrow-right"></i>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4 col-xl">
                <div class="card stat-card h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="stat-icon bg-warning-subtle text-warning me-3">
                            <i class="bi bi-building"></i>
                        </div>
                        <div>
                            <h3 class="mb-0">{{ stats.departmentsCount || 0 }}</h3>
                            <small class="text-muted">Отделений</small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 pt-0">
                        <router-link to="/admin/departments" class="btn btn-sm btn-outline-warning w-100">
                            Управление <i class="bi bi-arrow-right"></i>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4 col-xl">
                <div class="card stat-card h-100">
                    <div class="card-body d-flex align-items-center">
                        <div class="stat-icon bg-danger-subtle text-danger me-3">
                            <i class="bi bi-calendar-check"></i>
                        </div>
                        <div>
                            <h3 class="mb-0">{{ stats.appointmentsCount || 0 }}</h3>
                            <small class="text-muted">Записей</small>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 pt-0">
                        <router-link to="/admin/appointments" class="btn btn-sm btn-outline-danger w-100">
                            Управление <i class="bi bi-arrow-right"></i>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Быстрые действия -->
        <div class="card border-0 shadow-sm mt-4">
            <div class="card-header bg-white py-3">
                <h5 class="mb-0"><i class="bi bi-lightning-charge me-2"></i> Быстрые действия</h5>
            </div>
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <router-link to="/admin/services" class="btn btn-outline-primary w-100 py-3">
                            <i class="bi bi-plus-circle me-2"></i> Добавить услугу
                        </router-link>
                    </div>
                    <div class="col-md-4">
                        <router-link to="/admin/departments" class="btn btn-outline-success w-100 py-3">
                            <i class="bi bi-building-add me-2"></i> Добавить отделение
                        </router-link>
                    </div>
                    <div class="col-md-4">
                        <router-link to="/admin/appointments" class="btn btn-outline-info w-100 py-3">
                            <i class="bi bi-calendar-plus me-2"></i> Просмотр записей
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            stats: {},
            loading: false
        };
    },

    computed: {
        user() { return Store.state.user; }
    },

    created() {
        this.loadStats();
    },

    methods: {
        async loadStats() {
            this.loading = true;
            try {
                this.stats = await API.stats.getDashboard();
            } catch (error) {
                // Если эндпоинт не работает, считаем из загруженных данных
                this.stats = {
                    usersCount: 0,
                    doctorsCount: Store.state.doctors.length,
                    servicesCount: Store.state.services.length,
                    departmentsCount: Store.state.departments.length,
                    appointmentsCount: 0
                };
            } finally {
                this.loading = false;
            }
        }
    }
};

// ==================== ADMIN USERS ====================
const AdminUsers = {
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
                <h4 class="mb-1">Управление пользователями</h4>
                <p class="text-muted mb-0">Всего: {{ users.length }} пользователей</p>
            </div>
        </div>

        <!-- Загрузка -->
        <loading-spinner v-if="loading" message="Загрузка пользователей..." />

        <!-- Таблица пользователей -->
        <div v-else class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>ID</th>
                                <th>ФИО</th>
                                <th>Email</th>
                                <th>Телефон</th>
                                <th>Роль</th>
                                <th class="text-end">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{ user.id }}</td>
                                <td>{{ user.fullName }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.phone || 'Не указан' }}</td>
                                <td>
                                    <span v-if="user.admin || user.role === 'ADMIN'" class="badge bg-danger">Админ</span>
                                    <span v-else class="badge bg-secondary">Пользователь</span>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary btn-action me-1"
                                            @click="editUser(user)" title="Редактировать">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-warning btn-action me-1"
                                            @click="toggleAdmin(user)" title="Сменить роль">
                                        <i class="bi bi-arrow-repeat"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger btn-action"
                                            @click="deleteUser(user)" title="Удалить">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Модальное окно редактирования -->
        <div class="modal fade" id="editUserModal" tabindex="-1" ref="editModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form @submit.prevent="saveUser">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="bi bi-pencil me-2"></i> Редактирование пользователя
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">ФИО</label>
                                <input type="text" v-model="editForm.fullName" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" v-model="editForm.email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Телефон</label>
                                <input type="text" v-model="editForm.phone" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">
                                    Новый пароль <small class="text-muted">(оставьте пустым, чтобы не менять)</small>
                                </label>
                                <input type="password" v-model="editForm.password" class="form-control">
                            </div>
                            <div class="form-check">
                                <input type="checkbox" v-model="editForm.isAdmin" class="form-check-input" id="editIsAdmin">
                                <label class="form-check-label" for="editIsAdmin">Администратор</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="submit" class="btn btn-primary" :disabled="saving">
                                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                                <i v-else class="bi bi-check-lg me-1"></i> Сохранить
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
            users: [],
            loading: false,
            saving: false,
            success: null,
            error: null,
            editForm: {
                id: null,
                fullName: '',
                email: '',
                phone: '',
                password: '',
                isAdmin: false
            },
            editModal: null
        };
    },

    mounted() {
        this.editModal = new bootstrap.Modal(this.$refs.editModal);
        this.loadUsers();
    },

    methods: {
        async loadUsers() {
            this.loading = true;
            try {
                const response = await API.users.getAll();
                this.users = response.content || response;
            } catch (error) {
                console.error('Load users error:', error);
                this.error = 'Ошибка загрузки пользователей';
            } finally {
                this.loading = false;
            }
        },

        editUser(user) {
            this.editForm = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone || '',
                password: '',
                isAdmin: user.admin || user.role === 'ADMIN'
            };
            this.editModal.show();
        },

        async saveUser() {
            this.saving = true;
            try {
                await API.users.update(this.editForm.id, this.editForm);
                this.editModal.hide();
                this.success = 'Пользователь успешно обновлён';
                this.loadUsers();
            } catch (error) {
                console.error('Save user error:', error);
                this.error = error.response?.data?.message || 'Ошибка сохранения';
            } finally {
                this.saving = false;
            }
        },

        async toggleAdmin(user) {
            if (!confirm('Изменить роль пользователя?')) return;

            try {
                await API.users.toggleAdmin(user.id);
                this.success = 'Роль пользователя изменена';
                this.loadUsers();
            } catch (error) {
                console.error('Toggle admin error:', error);
                this.error = 'Ошибка изменения роли';
            }
        },

        async deleteUser(user) {
            if (!confirm(`Удалить пользователя "${user.fullName}"?`)) return;

            try {
                await API.users.delete(user.id);
                this.success = 'Пользователь удалён';
                this.loadUsers();
            } catch (error) {
                console.error('Delete user error:', error);
                this.error = 'Ошибка удаления пользователя';
            }
        }
    }
};