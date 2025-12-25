// ============================================
// ПУБЛИЧНЫЕ СТРАНИЦЫ
// ============================================

// ==================== HOME PAGE ====================
const HomePage = {
    template: `
    <div>
        <!-- Hero Section -->
        <section class="hero-section bg-primary text-white py-5">
            <div class="container py-5">
                <div class="row align-items-center">
                    <div class="col-lg-6">

                        <h1 class="display-4 fw-bold mb-4">
                            Современная медицина для всей семьи
                        </h1>
                        <p class="lead mb-4 opacity-75">
                            Передовые технологии диагностики, опытные специалисты и индивидуальный подход к каждому пациенту.
                        </p>
                        <div class="d-flex gap-3 flex-wrap">
                            <router-link v-if="isAuthenticated" to="/book-appointment" class="btn btn-light btn-lg px-4">
                                <i class="bi bi-calendar-plus me-2"></i> Записаться на приём
                            </router-link>
                            <router-link v-else to="/register" class="btn btn-light btn-lg px-4">
                                <i class="bi bi-calendar-plus me-2"></i> Записаться на приём
                            </router-link>
                            <router-link to="/services" class="btn btn-outline-light btn-lg px-4">
                                Наши услуги <i class="bi bi-arrow-right ms-2"></i>
                            </router-link>
                        </div>


                    </div>

                </div>
            </div>
        </section>

        <!-- Отделения -->
        <section class="py-5 bg-light">
            <div class="container py-4">
                <div class="text-center mb-5">
                    <span class="badge bg-primary-subtle text-primary mb-2">Отделения</span>
                    <h2 class="fw-bold">Направления нашей работы</h2>
                    <p class="text-muted">Полный спектр медицинских услуг в одном месте</p>
                </div>

                <div class="row g-4">
                    <div v-for="dept in departments" :key="dept.id" class="col-6 col-md-4 col-lg">
                        <div class="card h-100 border-0 shadow-sm department-card"
                             @click="goToServicesWithFilter(dept.name)">
                            <div class="card-body text-center p-4">
                                <div class="department-icon mb-3">
                                    <span class="fs-1">{{ getDepartmentIcon(dept.name) }}</span>
                                </div>
                                <h6 class="card-title fw-bold mb-2">{{ dept.name }}</h6>
                                <p class="card-text small text-muted mb-0">{{ dept.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!--  услуги -->
        <section class="py-5">
            <div class="container py-4">
                <div class="text-center mb-5">
                    <span class="badge bg-primary-subtle text-primary mb-2">Услуги</span>
                    <h2 class="fw-bold">Услуги</h2>

                </div>

                <div class="row g-4">
                    <div v-for="service in services.slice(0, 4)" :key="service.id" class="col-md-6 col-lg-3">
                        <div class="card h-100 border-0 shadow-sm service-card">
                            <div class="card-body d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <span class="badge bg-info-subtle text-info">
                                        {{ service.departmentName }}
                                    </span>
                                    <span class="text-primary fs-4">
                                        {{ getDepartmentIcon(service.departmentName) }}
                                    </span>
                                </div>
                                <h5 class="card-title fw-bold">{{ service.name }}</h5>
                                <p class="card-text text-muted small flex-grow-1">{{ service.description }}</p>
                                <hr>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="h5 text-primary mb-0 fw-bold">
                                        {{ formatPrice(service.price) }} ₽
                                    </span>
                                    <button class="btn btn-primary btn-sm" @click="bookService(service)">
                                        <i class="bi bi-calendar-plus me-1"></i> Записаться
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-5">
                    <router-link to="/services" class="btn btn-outline-primary btn-lg">
                        Все услуги <i class="bi bi-arrow-right ms-2"></i>
                    </router-link>
                </div>
            </div>
        </section>

        <!-- Врачи (БЕЗ ФОТО И СТАТУСА) -->
        <section class="py-5 bg-light">
            <div class="container py-4">
                <div class="text-center mb-5">
                    <span class="badge bg-primary-subtle text-primary mb-2">Команда</span>
                    <h2 class="fw-bold">Наши специалисты</h2>
                    <p class="text-muted">Опытные врачи с многолетним стажем работы</p>
                </div>

                <div class="row g-4 justify-content-center">
                    <div v-for="doctor in activeDoctors.slice(0, 4)" :key="doctor.id" class="col-sm-6 col-lg-3">
                        <div class="card h-100 border-0 shadow-sm doctor-card">
                            <div class="card-body text-center py-4">
                                <div class="doctor-avatar mb-3">
                                    <i class="bi bi-person-circle"></i>
                                </div>
                                <h5 class="card-title fw-bold mb-1">{{ doctor.fullName }}</h5>
                                <p class="text-primary mb-1">{{ doctor.specialization }}</p>
                                <p class="text-muted small mb-3">
                                    <i class="bi bi-building me-1"></i>{{ doctor.departmentName }}
                                </p>
                                <button class="btn btn-primary btn-sm w-100" @click="bookDoctor(doctor)">
                                    <i class="bi bi-calendar-check me-1"></i> Записаться
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center mt-5">
                    <router-link to="/doctors" class="btn btn-outline-primary btn-lg">
                        Все врачи <i class="bi bi-arrow-right ms-2"></i>
                    </router-link>
                </div>
            </div>
        </section>

    </div>
    `,

    computed: {
        departments() { return Store.state.departments; },
        doctors() { return Store.state.doctors; },
        services() { return Store.state.services; },
        isAuthenticated() { return Store.state.isAuthenticated; },
        activeDoctors() { return this.doctors.filter(d => d.active !== false); }
    },

    methods: {
        getDepartmentIcon(name) { return Store.getDepartmentIcon(name); },
        formatPrice(price) { return Store.formatPrice(price); },

        goToServicesWithFilter(departmentName) {
            Store.state.selectedDepartment = departmentName;
            this.$router.push('/services');
        },

        bookService(service) {
            if (Store.state.isAuthenticated) {
                this.$router.push(`/book-appointment?serviceId=${service.id}`);
            } else {
                this.$router.push('/login?redirect=/book-appointment');
            }
        },

        bookDoctor(doctor) {
            if (Store.state.isAuthenticated) {
                this.$router.push(`/book-appointment?doctorId=${doctor.id}`);
            } else {
                this.$router.push('/login?redirect=/book-appointment');
            }
        }
    }
};

// ==================== SERVICES PAGE ====================
const ServicesPage = {
    template: `
    <div class="py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h1 class="fw-bold">Наши услуги</h1>
                <p class="text-muted lead">Полный спектр медицинских услуг по доступным ценам</p>
            </div>

            <!-- Фильтр -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body py-3">
                    <div class="row align-items-center">
                        <div class="col-md-4 col-lg-3">
                            <div class="d-flex align-items-center">
                                <i class="bi bi-funnel text-primary me-2"></i>
                                <select v-model="selectedDepartment" class="form-select">
                                    <option :value="null">Все отделения</option>
                                    <option v-for="dept in departments" :key="dept.id" :value="dept.name">
                                        {{ dept.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-6 mt-2 mt-md-0">
                            <div v-if="selectedDepartment" class="d-flex align-items-center">
                                <span class="badge bg-primary fs-6 d-flex align-items-center">
                                    {{ getDepartmentIcon(selectedDepartment) }}
                                    <span class="ms-1">{{ selectedDepartment }}</span>
                                    <button type="button" class="btn-close btn-close-white ms-2"
                                            style="font-size: 0.6rem;" @click="selectedDepartment = null"></button>
                                </span>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3 text-md-end mt-2 mt-md-0">
                            <span class="text-muted">
                                <i class="bi bi-list-ul me-1"></i>
                                Найдено: <strong class="text-primary">{{ filteredServices.length }}</strong> услуг
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Список услуг -->
            <div class="row g-3">
                <div v-for="service in filteredServices" :key="service.id" class="col-12">
                    <div class="card border-0 shadow-sm service-row-card">
                        <div class="card-body">
                            <div class="row align-items-center">
                                <div class="col-lg-7">
                                    <div class="d-flex align-items-start">
                                        <span class="service-icon me-3">
                                            {{ getDepartmentIcon(service.departmentName) }}
                                        </span>
                                        <div>
                                            <h5 class="mb-1 fw-bold">{{ service.name }}</h5>
                                            <p class="text-muted mb-2">{{ service.description }}</p>
                                            <span class="badge bg-info-subtle text-info">
                                                {{ service.departmentName }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-5 mt-3 mt-lg-0">
                                    <div class="d-flex align-items-center justify-content-lg-end gap-4">
                                        <span class="h4 text-primary mb-0 fw-bold">
                                            {{ formatPrice(service.price) }} ₽
                                        </span>
                                        <button class="btn btn-primary px-4" @click="bookService(service)">
                                            <i class="bi bi-calendar-plus me-2"></i> Записаться
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredServices.length === 0" class="text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h4 class="mt-3">Услуги не найдены</h4>
                <p class="text-muted">В выбранном отделении нет услуг</p>
                <button class="btn btn-primary" @click="selectedDepartment = null">
                    <i class="bi bi-arrow-counterclockwise me-1"></i> Показать все услуги
                </button>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            selectedDepartment: Store.state.selectedDepartment
        };
    },

    computed: {
        departments() { return Store.state.departments; },
        services() { return Store.state.services; },

        filteredServices() {
            if (!this.selectedDepartment) return this.services;
            return this.services.filter(s => s.departmentName === this.selectedDepartment);
        }
    },

    methods: {
        getDepartmentIcon(name) { return Store.getDepartmentIcon(name); },
        formatPrice(price) { return Store.formatPrice(price); },

        bookService(service) {
            if (Store.state.isAuthenticated) {
                this.$router.push(`/book-appointment?serviceId=${service.id}`);
            } else {
                Store.showToast('Для записи необходимо авторизоваться', 'warning');
                this.$router.push('/login?redirect=/book-appointment');
            }
        }
    },

    mounted() {
        Store.state.selectedDepartment = null;
    }
};

// ==================== DOCTORS PAGE (БЕЗ ФОТО И СТАТУСА) ====================
const DoctorsPage = {
    template: `
    <div class="py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h1 class="fw-bold">Наши врачи</h1>
                <p class="text-muted lead">Команда опытных специалистов</p>
            </div>

            <!-- Фильтр -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body py-3">
                    <div class="row align-items-center">
                        <div class="col-md-4 col-lg-3">
                            <div class="d-flex align-items-center">
                                <i class="bi bi-funnel text-primary me-2"></i>
                                <select v-model="selectedDepartment" class="form-select">
                                    <option :value="null">Все отделения</option>
                                    <option v-for="dept in departments" :key="dept.id" :value="dept.name">
                                        {{ dept.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-6 mt-2 mt-md-0">
                            <div v-if="selectedDepartment" class="d-flex align-items-center">
                                <span class="badge bg-primary fs-6 d-flex align-items-center">
                                    {{ getDepartmentIcon(selectedDepartment) }}
                                    <span class="ms-1">{{ selectedDepartment }}</span>
                                    <button type="button" class="btn-close btn-close-white ms-2"
                                            style="font-size: 0.6rem;" @click="selectedDepartment = null"></button>
                                </span>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-3 text-md-end mt-2 mt-md-0">
                            <span class="text-muted">
                                <i class="bi bi-people me-1"></i>
                                Найдено: <strong class="text-primary">{{ filteredDoctors.length }}</strong> врачей
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Список врачей -->
            <div class="row g-4">
                <div v-for="doctor in filteredDoctors" :key="doctor.id" class="col-sm-6 col-lg-4 col-xl-3">
                    <div class="card h-100 border-0 shadow-sm doctor-card">
                        <div class="card-body text-center py-4">
                            <div class="doctor-avatar mb-3">
                                <i class="bi bi-person-circle"></i>
                            </div>
                            <h5 class="card-title fw-bold mb-1">{{ doctor.fullName }}</h5>
                            <p class="text-primary mb-1">{{ doctor.specialization }}</p>
                            <p class="text-muted small mb-3">
                                <i class="bi bi-building me-1"></i> {{ doctor.departmentName }}
                            </p>
                            <button class="btn btn-primary w-100" @click="bookDoctor(doctor)">
                                <i class="bi bi-calendar-check me-1"></i> Записаться на приём
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredDoctors.length === 0" class="text-center py-5">
                <i class="bi bi-person-x display-1 text-muted"></i>
                <h4 class="mt-3">Врачи не найдены</h4>
                <p class="text-muted">В выбранном отделении нет врачей</p>
                <button class="btn btn-primary" @click="selectedDepartment = null">
                    <i class="bi bi-arrow-counterclockwise me-1"></i> Показать всех врачей
                </button>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            selectedDepartment: null
        };
    },

    computed: {
        departments() { return Store.state.departments; },
        doctors() { return Store.state.doctors; },

        filteredDoctors() {
            let result = this.doctors;
            if (this.selectedDepartment) {
                result = result.filter(d => d.departmentName === this.selectedDepartment);
            }
            return result;
        }
    },

    methods: {
        getDepartmentIcon(name) { return Store.getDepartmentIcon(name); },

        bookDoctor(doctor) {
            if (Store.state.isAuthenticated) {
                this.$router.push(`/book-appointment?doctorId=${doctor.id}`);
            } else {
                Store.showToast('Для записи необходимо авторизоваться', 'warning');
                this.$router.push('/login?redirect=/book-appointment');
            }
        }
    }
};


console.log(' pages.js загружен');