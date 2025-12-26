// ==================== ADMIN DASHBOARD (полный код) ====================
const AdminDashboard = {
    template: `
    <div>
        <h4 class="mb-4">
            <i class="bi bi-speedometer2 me-2"></i>Панель управления
        </h4>

        <!-- Загрузка -->
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
                        <div class="card-footer bg-transparent border-0">
                            <router-link to="/admin/users" class="text-white text-decoration-none small">
                                Управление <i class="bi bi-arrow-right"></i>
                            </router-link>
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
                        <div class="card-footer bg-transparent border-0">
                            <router-link to="/admin/doctors" class="text-white text-decoration-none small">
                                Управление <i class="bi bi-arrow-right"></i>
                            </router-link>
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
                        <div class="card-footer bg-transparent border-0">
                            <router-link to="/admin/services" class="text-white text-decoration-none small">
                                Управление <i class="bi bi-arrow-right"></i>
                            </router-link>
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
                        <div class="card-footer bg-transparent border-0">
                            <router-link to="/admin/appointments" class="text-dark text-decoration-none small">
                                Управление <i class="bi bi-arrow-right"></i>
                            </router-link>
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

            <div class="row g-4 mb-4">
                <!-- Популярные услуги -->
                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white border-0 py-3">
                            <h5 class="mb-0">
                                <i class="bi bi-star-fill text-warning me-2"></i>
                                Популярные услуги
                            </h5>
                            <small class="text-muted">За последние 6 месяцев</small>
                        </div>
                        <div class="card-body p-0">
                            <div v-if="stats.popularServices && stats.popularServices.length" class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Услуга</th>
                                            <th class="text-center">Записей</th>
                                            <th class="text-end">Выручка</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(service, index) in stats.popularServices" :key="service.id">
                                            <td>
                                                <span class="badge bg-primary me-2">{{ index + 1 }}</span>
                                                <strong>{{ service.name }}</strong>
                                                <br>
                                                <small class="text-muted">{{ service.departmentName }}</small>
                                            </td>
                                            <td class="text-center">
                                                <span class="badge bg-info">{{ service.appointmentsCount }}</span>
                                            </td>
                                            <td class="text-end text-success fw-bold">
                                                {{ formatPrice(service.totalRevenue) }} ₽
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="text-center py-4 text-muted">
                                <i class="bi bi-inbox display-4"></i>
                                <p class="mt-2">Нет данных</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Популярные врачи -->
                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-header bg-white border-0 py-3">
                            <h5 class="mb-0">
                                <i class="bi bi-trophy-fill text-warning me-2"></i>
                                Топ врачи
                            </h5>
                            <small class="text-muted">По количеству приёмов</small>
                        </div>
                        <div class="card-body p-0">
                            <div v-if="stats.popularDoctors && stats.popularDoctors.length" class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Врач</th>
                                            <th class="text-center">Приёмов</th>
                                            <th class="text-center">Завершено</th>
                                            <th class="text-end">Выручка</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(doctor, index) in stats.popularDoctors" :key="doctor.id">
                                            <td>
                                                <span class="badge me-2"
                                                      :class="index === 0 ? 'bg-warning text-dark' : index === 1 ? 'bg-secondary' : 'bg-dark'">
                                                    {{ index + 1 }}
                                                </span>
                                                <strong>{{ doctor.fullName }}</strong>
                                                <br>
                                                <small class="text-muted">{{ doctor.specialization }}</small>
                                            </td>
                                            <td class="text-center">
                                                <span class="badge bg-primary">{{ doctor.appointmentsCount }}</span>
                                            </td>
                                            <td class="text-center">
                                                <span class="badge bg-success">{{ doctor.completedCount }}</span>
                                            </td>
                                            <td class="text-end text-success fw-bold">
                                                {{ formatPrice(doctor.totalRevenue) }} ₽
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="text-center py-4 text-muted">
                                <i class="bi bi-inbox display-4"></i>
                                <p class="mt-2">Нет данных</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Статистика по месяцам -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0">
                        <i class="bi bi-graph-up me-2"></i>
                        Динамика по месяцам
                    </h5>
                </div>
                <div class="card-body p-0">
                    <div v-if="stats.monthlyStats && stats.monthlyStats.length" class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Месяц</th>
                                    <th class="text-center">Всего записей</th>
                                    <th class="text-center">Завершено</th>
                                    <th class="text-center">Отменено</th>
                                    <th class="text-end">Выручка</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="month in stats.monthlyStats" :key="month.year + '-' + month.month">
                                    <td><strong>{{ month.monthName }}</strong></td>
                                    <td class="text-center">
                                        <span class="badge bg-primary">{{ month.appointmentsCount }}</span>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge bg-success">{{ month.completedCount }}</span>
                                    </td>
                                    <td class="text-center">
                                        <span class="badge bg-danger">{{ month.cancelledCount }}</span>
                                    </td>
                                    <td class="text-end text-success fw-bold">
                                        {{ formatPrice(month.totalRevenue) }} ₽
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot class="table-light">
                                <tr>
                                    <td><strong>Итого</strong></td>
                                    <td class="text-center"><strong>{{ totalMonthlyAppointments }}</strong></td>
                                    <td class="text-center"><strong>{{ totalMonthlyCompleted }}</strong></td>
                                    <td class="text-center"><strong>{{ totalMonthlyCancelled }}</strong></td>
                                    <td class="text-end text-success"><strong>{{ formatPrice(totalMonthlyRevenue) }} ₽</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div v-else class="text-center py-4 text-muted">
                        <i class="bi bi-bar-chart display-4"></i>
                        <p class="mt-2">Нет данных за период</p>
                    </div>
                </div>
            </div>

            <!-- Статистика по отделениям -->
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-white border-0 py-3">
                    <h5 class="mb-0">
                        <i class="bi bi-building me-2"></i>
                        Статистика по отделениям
                    </h5>
                    <small class="text-muted">За последний год</small>
                </div>
                <div class="card-body p-0">
                    <div v-if="stats.departmentStats && stats.departmentStats.length">
                        <div class="accordion accordion-flush" id="departmentsAccordion">
                            <div v-for="(dept, index) in stats.departmentStats"
                                 :key="dept.id" class="accordion-item">
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
                                                <span class="text-success fw-bold">{{ formatPrice(dept.totalRevenue) }} ₽</span>
                                            </div>
                                        </div>
                                    </button>
                                </h2>
                                <div :id="'dept-' + dept.id" class="accordion-collapse collapse"
                                     data-bs-parent="#departmentsAccordion">
                                    <div class="accordion-body bg-light">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="card border-0 mb-2">
                                                    <div class="card-body py-2">
                                                        <small class="text-muted">Услуг</small>
                                                        <h5 class="mb-0">{{ dept.servicesCount }}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="card border-0 mb-2">
                                                    <div class="card-body py-2">
                                                        <small class="text-muted">Завершено</small>
                                                        <h5 class="mb-0 text-success">{{ dept.completedCount }}</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="card border-0 mb-2">
                                                    <div class="card-body py-2">
                                                        <small class="text-muted">Выручка</small>
                                                        <h5 class="mb-0 text-primary">{{ formatPrice(dept.totalRevenue) }} ₽</h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h6 class="mt-3 mb-2">Топ врачи отделения:</h6>
                                        <div v-if="dept.topDoctors && dept.topDoctors.length" class="list-group">
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
                                        <div v-else class="text-muted small">
                                            Нет данных о врачах
                                        </div>
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

    computed: {
        totalMonthlyAppointments() {
            if (!this.stats.monthlyStats) return 0;
            return this.stats.monthlyStats.reduce((sum, m) => sum + (m.appointmentsCount || 0), 0);
        },
        totalMonthlyCompleted() {
            if (!this.stats.monthlyStats) return 0;
            return this.stats.monthlyStats.reduce((sum, m) => sum + (m.completedCount || 0), 0);
        },
        totalMonthlyCancelled() {
            if (!this.stats.monthlyStats) return 0;
            return this.stats.monthlyStats.reduce((sum, m) => sum + (m.cancelledCount || 0), 0);
        },
        totalMonthlyRevenue() {
            if (!this.stats.monthlyStats) return 0;
            return this.stats.monthlyStats.reduce((sum, m) => sum + parseFloat(m.totalRevenue || 0), 0);
        }
    },

    mounted() {
        this.loadStats();
    },

    methods: {
        async loadStats() {
            this.loading = true;
            try {
                this.stats = await API.stats.getDashboard();
                console.log('Dashboard stats loaded:', this.stats);
            } catch (error) {
                console.error('Error loading stats:', error);
                Store.showToast('Ошибка загрузки статистики', 'error');
            } finally {
                this.loading = false;
            }
        },

        formatPrice(price) {
            return Store.formatPrice(price);
        },

        getDepartmentIcon(name) {
            return Store.getDepartmentIcon(name);
        }
    }
};