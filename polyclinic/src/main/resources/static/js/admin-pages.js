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
        <h4 class="mb-4">
            <i class="bi bi-speedometer2 me-2"></i>Панель управления
        </h4>

        <loading-spinner v-if="loading" message="Загрузка статистики..." />

        <template v-else>
            <!-- Основные карточки -->
            <div class="row g-4 mb-4">
                <div class="col-6 col-lg-3">
                    <div class="card bg-primary text-white h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="card-subtitle mb-2 opacity-75">Пользователи</h6>
                                    <h2 class="mb-0">{{ stats.usersCount || 0 }}</h2>
                                </div>
                                <i class="bi bi-people display-4 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-lg-3">
                    <div class="card bg-success text-white h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="card-subtitle mb-2 opacity-75">Врачи</h6>
                                    <h2 class="mb-0">{{ stats.doctorsCount || 0 }}</h2>
                                </div>
                                <i class="bi bi-person-badge display-4 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-lg-3">
                    <div class="card bg-info text-white h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="card-subtitle mb-2 opacity-75">Услуги</h6>
                                    <h2 class="mb-0">{{ stats.servicesCount || 0 }}</h2>
                                </div>
                                <i class="bi bi-clipboard2-pulse display-4 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-lg-3">
                    <div class="card bg-warning text-dark h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="card-subtitle mb-2 opacity-75">Записи</h6>
                                    <h2 class="mb-0">{{ stats.appointmentsCount || 0 }}</h2>
                                </div>
                                <i class="bi bi-calendar-check display-4 opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Статистика за месяц -->
            <div class="row g-4 mb-4">
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                                    <i class="bi bi-calendar-event text-primary fs-3"></i>
                                </div>
                                <div>
                                    <h6 class="text-muted mb-1">Записей за этот месяц</h6>
                                    <h3 class="mb-0">{{ stats.appointmentsThisMonth || 0 }}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                                    <i class="bi bi-currency-dollar text-success fs-3"></i>
                                </div>
                                <div>
                                    <h6 class="text-muted mb-1">Выручка за месяц</h6>
                                    <h3 class="mb-0 text-success">{{ formatPrice(stats.revenueThisMonth) }} ₽</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Статистика по отделениям -->
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0">
                        <i class="bi bi-building me-2"></i>
                        Объём услуг по отделениям
                    </h5>
                    <small class="text-muted">За последний год</small>
                </div>
                <div class="card-body p-0">
                    <div v-if="stats.departmentStats && stats.departmentStats.length > 0">
                        <div class="accordion accordion-flush" id="departmentsAccordion">
                            <div v-for="dept in stats.departmentStats" :key="dept.id" class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            :data-bs-target="'#dept-' + dept.id">
                                        <div class="d-flex justify-content-between align-items-center w-100 me-3">
                                            <div>
                                                <span class="me-2">{{ getDepartmentIcon(dept.name) }}</span>
                                                <strong>{{ dept.name }}</strong>
                                                <span class="badge bg-secondary ms-2">{{ dept.doctorsCount }} врачей</span>
                                            </div>
                                            <div class="text-end">
                                                <span class="badge bg-primary me-2">{{ dept.appointmentsCount }} записей</span>
                                                <span class="badge bg-success me-2">{{ dept.completedCount }} завершено</span>
                                                <span class="text-success fw-bold">{{ formatPrice(dept.totalRevenue) }} ₽</span>
                                            </div>
                                        </div>
                                    </button>
                                </h2>
                                <div :id="'dept-' + dept.id" class="accordion-collapse collapse"
                                     data-bs-parent="#departmentsAccordion">
                                    <div class="accordion-body bg-light">
                                        <h6 class="mb-3">Топ врачи отделения:</h6>
                                        <div v-if="dept.topDoctors && dept.topDoctors.length > 0" class="list-group">
                                            <div v-for="doc in dept.topDoctors" :key="doc.id"
                                                 class="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{{ doc.fullName }}</strong>
                                                    <br><small class="text-muted">{{ doc.specialization }}</small>
                                                </div>
                                                <div class="text-end">
                                                    <span class="badge bg-info me-2">{{ doc.appointmentsCount }} приёмов</span>
                                                    <span class="text-success fw-bold">{{ formatPrice(doc.totalRevenue) }} ₽</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else class="text-muted">Нет данных о врачах</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-4 text-muted">
                        <i class="bi bi-building display-4"></i>
                        <p class="mt-2">Нет данных по отделениям</p>
                    </div>
                </div>
            </div>
        </template>
    </div>
    `,

    data() {
        return {
            stats: {},
            loading: false
        };
    },

    mounted() {
        this.loadStats();
    },

    methods: {
        async loadStats() {
            this.loading = true;
            try {
                this.stats = await API.stats.getDashboard();
                console.log('Dashboard stats:', this.stats);
            } catch (error) {
                console.error('Error loading stats:', error);
                Store.showToast('Ошибка загрузки статистики', 'error');
            } finally {
                this.loading = false;
            }
        },

        formatPrice(price) {
            if (price === null || price === undefined) return '0';
            return Store.formatPrice(price);
        },

        getDepartmentIcon(name) {
            return Store.getDepartmentIcon(name);
        }
    }
};
// ==================== ADMIN USERS ====================
const AdminUsers = {
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
                <h4 class="mb-1">Управление пользователями</h4>
                <p class="text-muted mb-0">Всего: {{ totalItems }} пользователей</p>
            </div>
        </div>

        <!-- Фильтры -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Роль</label>
                        <select v-model="filters.isAdmin" class="form-select" @change="applyFilters">
                            <option :value="null">Все пользователи</option>
                            <option :value="true">Администраторы</option>
                            <option :value="false">Обычные пользователи</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Сортировка</label>
                        <select v-model="sortBy" class="form-select" @change="applyFilters">
                            <option value="id">По ID</option>
                            <option value="fullName">По имени</option>
                            <option value="email">По email</option>
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

        <loading-spinner v-if="loading" message="Загрузка пользователей..." />

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
                                <td><strong>{{ user.fullName }}</strong></td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.phone || '—' }}</td>
                                <td>
                                    <span class="badge" :class="user.admin ? 'bg-danger' : 'bg-secondary'">
                                        {{ user.admin ? 'Админ' : 'Пользователь' }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-1"
                                            @click="editUser(user)" title="Редактировать">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm me-1"
                                            :class="user.admin ? 'btn-warning' : 'btn-outline-success'"
                                            @click="toggleAdmin(user)" title="Изменить роль">
                                        <i class="bi bi-shield"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger"
                                            @click="deleteUser(user)" title="Удалить">
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

            <div v-if="users.length === 0 && !loading" class="card-body text-center py-5">
                <i class="bi bi-people display-1 text-muted"></i>
                <h5 class="mt-3">Пользователи не найдены</h5>
            </div>
        </div>

        <!-- Модальное окно -->
        <div class="modal fade" id="userModal" tabindex="-1" ref="userModal">
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
                                <input type="text" v-model="form.fullName" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" v-model="form.email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Телефон</label>
                                <input type="tel" v-model="form.phone" class="form-control">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Новый пароль <small class="text-muted">(оставьте пустым)</small></label>
                                <input type="password" v-model="form.password" class="form-control">
                            </div>
                            <div class="form-check">
                                <input type="checkbox" v-model="form.isAdmin" class="form-check-input" id="isAdminCheck">
                                <label class="form-check-label" for="isAdminCheck">Администратор</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="submit" class="btn btn-primary" :disabled="saving">
                                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                                Сохранить
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
            currentPage: 0,
            totalPages: 0,
            totalItems: 0,
            filters: { isAdmin: null },
            sortBy: 'id',
            form: { id: null, fullName: '', email: '', phone: '', password: '', isAdmin: false },
            modal: null
        };
    },

    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.userModal);
        this.loadUsers();
    },

    methods: {
        async loadUsers() {
            this.loading = true;
            try {
                const response = await API.users.getAll({
                    page: this.currentPage,
                    isAdmin: this.filters.isAdmin,
                    sortBy: this.sortBy
                });
                this.users = response.content || [];
                this.currentPage = response.number || 0;
                this.totalPages = response.totalPages || 1;
                this.totalItems = response.totalElements || 0;
            } catch (error) {
                this.error = 'Ошибка загрузки пользователей';
            } finally {
                this.loading = false;
            }
        },

        applyFilters() {
            this.currentPage = 0;
            this.loadUsers();
        },

        resetFilters() {
            this.filters = { isAdmin: null };
            this.sortBy = 'id';
            this.currentPage = 0;
            this.loadUsers();
        },

        goToPage(page) {
            this.currentPage = page;
            this.loadUsers();
        },

        editUser(user) {
            this.form = {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone || '',
                password: '',
                isAdmin: user.admin
            };
            this.modal.show();
        },

        async saveUser() {
            this.saving = true;
            try {
                const data = {
                    fullName: this.form.fullName,
                    email: this.form.email,
                    phone: this.form.phone,
                    isAdmin: this.form.isAdmin
                };
                if (this.form.password) data.password = this.form.password;

                await API.users.update(this.form.id, data);
                this.success = 'Пользователь обновлён';
                this.modal.hide();
                this.loadUsers();
            } catch (error) {
                this.error = error.response?.data?.message || 'Ошибка сохранения';
            } finally {
                this.saving = false;
            }
        },

        async toggleAdmin(user) {
            if (!confirm(`Изменить роль пользователя "${user.fullName}"?`)) return;
            try {
                await API.users.toggleAdmin(user.id);
                user.admin = !user.admin;
                this.success = 'Роль изменена';
            } catch (error) {
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
                this.error = 'Ошибка удаления';
            }
        }
    }
};