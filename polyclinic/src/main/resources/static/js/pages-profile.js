// ============================================
// СТРАНИЦЫ ПРОФИЛЯ
// ============================================

// ==================== PROFILE PAGE ====================
const ProfilePage = {
    template: `
    <div>
        <!-- Шапка профиля -->
        <div class="profile-header">
            <div class="container text-center">
                <div class="profile-avatar">
                    <i class="bi bi-person"></i>
                </div>
                <h2>{{ user?.fullName }}</h2>
                <p class="opacity-75 mb-0">{{ user?.email }}</p>
            </div>
        </div>

        <div class="container py-5">
            <div class="row">
                <!-- Боковое меню -->
                <div class="col-md-3 mb-4">
                    <div class="card profile-card">
                        <div class="card-body p-3">
                            <nav class="nav nav-pills flex-column">
                                <router-link class="nav-link" to="/profile" exact-active-class="active">
                                    <i class="bi bi-person me-2"></i> Мой профиль
                                </router-link>
                                <router-link class="nav-link" to="/my-appointments" active-class="active">
                                    <i class="bi bi-calendar-check me-2"></i> Мои записи
                                </router-link>
                                <router-link class="nav-link" to="/book-appointment">
                                    <i class="bi bi-calendar-plus me-2"></i> Записаться на приём
                                </router-link>
                                <template v-if="isAdmin">
                                    <hr>
                                    <router-link class="nav-link text-primary" to="/admin">
                                        <i class="bi bi-gear me-2"></i> Админ-панель
                                    </router-link>
                                </template>
                            </nav>
                        </div>
                    </div>
                </div>

                <!-- Основной контент -->
                <div class="col-md-9">
                    <!-- Уведомления -->
                    <div v-if="success" class="alert alert-success alert-dismissible fade show">
                        <i class="bi bi-check-circle me-2"></i> {{ success }}
                        <button type="button" class="btn-close" @click="success = null"></button>
                    </div>
                    <div v-if="error" class="alert alert-danger alert-dismissible fade show">
                        <i class="bi bi-exclamation-circle me-2"></i> {{ error }}
                        <button type="button" class="btn-close" @click="error = null"></button>
                    </div>

                    <div class="card profile-card">
                        <div class="card-header bg-white py-3">
                            <h5 class="mb-0"><i class="bi bi-person-gear me-2"></i> Редактирование профиля</h5>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="updateProfile">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">ФИО</label>
                                        <input type="text" v-model="form.fullName" class="form-control" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Email</label>
                                        <input type="email" v-model="form.email" class="form-control" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Телефон</label>
                                        <input type="tel" v-model="form.phone" class="form-control"
                                               placeholder="+7 (999) 123-45-67">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">
                                            Новый пароль
                                            <small class="text-muted">(оставьте пустым, чтобы не менять)</small>
                                        </label>
                                        <input type="password" v-model="form.password" class="form-control"
                                               placeholder="Минимум 6 символов">
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <button type="submit" class="btn btn-primary" :disabled="loading">
                                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="bi bi-check-lg me-1"></i>
                                        Сохранить изменения
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            form: {
                fullName: '',
                email: '',
                phone: '',
                password: ''
            },
            loading: false,
            success: null,
            error: null
        };
    },

    computed: {
        user() { return Store.state.user; },
        isAdmin() { return Store.state.isAdmin; }
    },

    created() {
        this.loadUserData();
    },

    methods: {
        loadUserData() {
            if (this.user) {
                this.form.fullName = this.user.fullName || '';
                this.form.email = this.user.email || '';
                this.form.phone = this.user.phone || '';
            }
        },

        async updateProfile() {
            this.loading = true;
            this.success = null;
            this.error = null;

            try {
                const data = {
                    fullName: this.form.fullName,
                    email: this.form.email,
                    phone: this.form.phone
                };

                if (this.form.password) {
                    data.password = this.form.password;
                }

                const updatedUser = await API.auth.updateProfile(data);
                Store.setUser(updatedUser);

                this.success = 'Профиль успешно обновлён';
                this.form.password = '';

            } catch (error) {
                console.error('Update profile error:', error);
                this.error = error.response?.data?.message || 'Ошибка обновления профиля';
            } finally {
                this.loading = false;
            }
        }
    },

    watch: {
        user: {
            handler() {
                this.loadUserData();
            },
            immediate: true
        }
    }
};

// ==================== MY APPOINTMENTS PAGE ====================
const MyAppointmentsPage = {
    template: `
    <div>
        <!-- Шапка -->
        <div class="profile-header">
            <div class="container">
                <h2><i class="bi bi-calendar-check me-2"></i> Мои записи</h2>
                <p class="opacity-75 mb-0">История и предстоящие приёмы</p>
            </div>
        </div>

        <div class="container py-5">
            <div class="row">
                <!-- Боковое меню -->
                <div class="col-md-3 mb-4">
                    <div class="card profile-card">
                        <div class="card-body p-3">
                            <nav class="nav nav-pills flex-column">
                                <router-link class="nav-link" to="/profile">
                                    <i class="bi bi-person me-2"></i> Мой профиль
                                </router-link>
                                <router-link class="nav-link" to="/my-appointments" exact-active-class="active">
                                    <i class="bi bi-calendar-check me-2"></i> Мои записи
                                </router-link>
                                <router-link class="nav-link" to="/book-appointment">
                                    <i class="bi bi-calendar-plus me-2"></i> Записаться на приём
                                </router-link>
                                <template v-if="isAdmin">
                                    <hr>
                                    <router-link class="nav-link text-primary" to="/admin">
                                        <i class="bi bi-gear me-2"></i> Админ-панель
                                    </router-link>
                                </template>
                            </nav>
                        </div>
                    </div>
                </div>

                <!-- Основной контент -->
                <div class="col-md-9">
                    <!-- Уведомления -->
                    <div v-if="success" class="alert alert-success alert-dismissible fade show">
                        <i class="bi bi-check-circle me-2"></i> {{ success }}
                        <button type="button" class="btn-close" @click="success = null"></button>
                    </div>
                    <div v-if="error" class="alert alert-danger alert-dismissible fade show">
                        <i class="bi bi-exclamation-circle me-2"></i> {{ error }}
                        <button type="button" class="btn-close" @click="error = null"></button>
                    </div>

                    <!-- Кнопка записи -->
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="mb-0">Ваши записи</h5>
                        <router-link to="/book-appointment" class="btn btn-primary">
                            <i class="bi bi-plus-lg me-1"></i> Новая запись
                        </router-link>
                    </div>

                    <!-- Загрузка -->
                    <loading-spinner v-if="loading" message="Загрузка записей..." />

                    <!-- Если записей нет -->
                    <div v-else-if="appointments.length === 0" class="card profile-card">
                        <div class="card-body text-center py-5">
                            <i class="bi bi-calendar-x display-1 text-muted"></i>
                            <h5 class="mt-3">У вас пока нет записей</h5>
                            <p class="text-muted">Запишитесь на приём к врачу</p>
                            <router-link to="/book-appointment" class="btn btn-primary">
                                <i class="bi bi-calendar-plus me-1"></i> Записаться
                            </router-link>
                        </div>
                    </div>

                    <!-- Список записей -->
                    <div v-else class="d-flex flex-column gap-3">
                        <div v-for="app in appointments" :key="app.id"
                             class="card profile-card appointment-card"
                             :class="getAppointmentClass(app.status)">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-8">
                                        <h6 class="mb-1 fw-bold">{{ app.serviceName }}</h6>
                                        <p class="mb-1 text-muted">
                                            <i class="bi bi-person-badge me-1"></i>
                                            Врач: {{ app.doctorName }}
                                        </p>
                                        <p class="mb-0">
                                            <i class="bi bi-calendar me-1"></i>
                                            {{ formatDate(app.appointmentDate) }}
                                        </p>
                                    </div>
                                    <div class="col-md-4 text-md-end mt-3 mt-md-0">
                                        <div class="mb-2">
                                            <span class="badge fs-6" :class="getStatusBadgeClass(app.status)">
                                                <i :class="getStatusIcon(app.status)" class="me-1"></i>
                                                {{ app.status }}
                                            </span>
                                        </div>
                                        <div class="h5 text-primary mb-2">
                                            {{ app.price ? formatPrice(app.price) + ' ₽' : '-' }}
                                        </div>
                                        <!-- Кнопка отмены только для запланированных -->
                                        <button v-if="app.status === 'Запланирован'"
                                                class="btn btn-sm btn-outline-danger"
                                                @click="cancelAppointment(app)"
                                                :disabled="cancellingId === app.id">
                                            <span v-if="cancellingId === app.id"
                                                  class="spinner-border spinner-border-sm me-1"></span>
                                            <i v-else class="bi bi-x-lg me-1"></i>
                                            Отменить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            appointments: [],
            loading: false,
            cancellingId: null,
            success: null,
            error: null
        };
    },

    computed: {
        isAdmin() { return Store.state.isAdmin; }
    },

    created() {
        this.loadAppointments();
    },

    methods: {
        async loadAppointments() {
            this.loading = true;
            try {
                this.appointments = await API.appointments.getMy();
            } catch (error) {
                console.error('Load appointments error:', error);
                this.error = 'Ошибка загрузки записей';
            } finally {
                this.loading = false;
            }
        },

        async cancelAppointment(appointment) {
            if (!confirm('Вы уверены, что хотите отменить запись?')) return;

            this.cancellingId = appointment.id;
            this.error = null;

            try {
                await API.appointments.cancel(appointment.id);
                appointment.status = 'Отменен';
                this.success = 'Запись успешно отменена';
            } catch (error) {
                console.error('Cancel appointment error:', error);
                this.error = 'Ошибка отмены записи';
            } finally {
                this.cancellingId = null;
            }
        },

        formatDate(date) {
            return Store.formatDate(date);
        },

        formatPrice(price) {
            return Store.formatPrice(price);
        },

        getAppointmentClass(status) {
            const classes = {
                'Отменен': 'cancelled',
                'Завершен': 'completed',
                'Перенесен': 'rescheduled'
            };
            return classes[status] || '';
        },

        getStatusBadgeClass(status) {
            const classes = {
                'Запланирован': 'bg-primary',
                'Завершен': 'bg-success',
                'Отменен': 'bg-danger',
                'Перенесен': 'bg-warning text-dark'
            };
            return classes[status] || 'bg-secondary';
        },

        getStatusIcon(status) {
            const icons = {
                'Запланирован': 'bi bi-clock',
                'Завершен': 'bi bi-check-circle',
                'Отменен': 'bi bi-x-circle',
                'Перенесен': 'bi bi-arrow-repeat'
            };
            return icons[status] || 'bi bi-question-circle';
        }
    }
};

// ==================== BOOK APPOINTMENT PAGE ====================
const BookAppointmentPage = {
    template: `
    <div>

        <!-- Шапка -->
        <div class="booking-header">
            <div class="container text-center">
                <h2><i class="bi bi-calendar-plus me-2"></i> Запись на приём</h2>
                <p class="opacity-75 mb-0">Выберите услугу, врача и удобное время</p>
            </div>
        </div>

        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <!-- Уведомления -->
                    <div v-if="success" class="alert alert-success">
                        <i class="bi bi-check-circle me-2"></i> {{ success }}
                        <router-link to="/my-appointments" class="alert-link ms-2">
                            Перейти к записям
                        </router-link>
                    </div>
                    <div v-if="error" class="alert alert-danger">
                        <i class="bi bi-exclamation-circle me-2"></i> {{ error }}
                    </div>

                    <div class="card booking-card">
                        <div class="card-body p-4">
                            <form @submit.prevent="bookAppointment">

                                <!-- Шаг 1: Выбор отделения -->
                                <div class="mb-4">
                                    <label class="form-label fw-bold">
                                        <span class="badge bg-primary me-2">1</span> Выберите отделение
                                    </label>
                                    <select v-model="selectedDepartmentId" class="form-select form-select-lg"
                                            @change="onDepartmentChange">
                                        <option :value="null">Все отделения</option>
                                        <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                            {{ dept.name }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Шаг 2: Выбор услуги -->
                                <div class="mb-4">
                                    <label class="form-label fw-bold">
                                        <span class="badge bg-primary me-2">2</span> Выберите услугу
                                    </label>
                                    <select v-model="form.serviceId" class="form-select form-select-lg" required>
                                        <option :value="null">Выберите услугу</option>
                                        <option v-for="service in filteredServices" :key="service.id" :value="service.id">
                                            {{ service.name }} - {{ formatPrice(service.price) }} ₽
                                        </option>
                                    </select>
                                </div>

                                <!-- Шаг 3: Выбор врача -->
                                <div class="mb-4">
                                    <label class="form-label fw-bold">
                                        <span class="badge bg-primary me-2">3</span> Выберите врача
                                    </label>
                                    <select v-model="form.doctorId" class="form-select form-select-lg" required>
                                        <option :value="null">Выберите врача</option>
                                        <option v-for="doctor in filteredDoctors" :key="doctor.id" :value="doctor.id">
                                            {{ doctor.fullName }} ({{ doctor.specialization }})
                                        </option>
                                    </select>
                                </div>

                                <!-- Шаг 4: Дата и время -->
                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold">
                                            <span class="badge bg-primary me-2">4</span> Дата приёма
                                        </label>
                                        <input type="date" v-model="form.appointmentDate"
                                               class="form-control form-control-lg" required
                                               :min="minDate">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold">
                                            <span class="badge bg-primary me-2">5</span> Время приёма
                                        </label>
                                        <select v-model="form.appointmentTime" class="form-select form-select-lg" required>
                                            <option :value="null">Выберите время</option>
                                            <option v-for="slot in timeSlots" :key="slot" :value="slot">
                                                {{ slot }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Примечания -->
                                <div class="mb-4">
                                    <label class="form-label">Примечания (необязательно)</label>
                                    <textarea v-model="form.notes" class="form-control" rows="3"
                                              placeholder="Опишите симптомы или причину обращения"></textarea>
                                </div>

                                <!-- Кнопки -->
                                <div class="d-flex justify-content-between">
                                    <router-link to="/" class="btn btn-outline-secondary btn-lg">
                                        <i class="bi bi-arrow-left me-1"></i> Назад
                                    </router-link>
                                    <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
                                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="bi bi-calendar-check me-1"></i>
                                        {{ loading ? 'Запись...' : 'Записаться' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            selectedDepartmentId: null,
            form: {
                serviceId: null,
                doctorId: null,
                appointmentDate: '',
                appointmentTime: null,
                notes: ''
            },
            timeSlots: [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
            ],
            loading: false,
            success: null,
            error: null
        };
    },

    computed: {
        departments() { return Store.state.departments; },
        services() { return Store.state.services; },
        doctors() { return Store.state.doctors; },

        filteredServices() {
            if (!this.selectedDepartmentId) return this.services;
            const dept = this.departments.find(d => d.id === this.selectedDepartmentId);
            if (!dept) return this.services;
            return this.services.filter(s => s.departmentName === dept.name);
        },

        filteredDoctors() {
            let result = this.doctors.filter(d => d.active);
            if (this.selectedDepartmentId) {
                const dept = this.departments.find(d => d.id === this.selectedDepartmentId);
                if (dept) {
                    result = result.filter(d => d.departmentName === dept.name);
                }
            }
            return result;
        },

        minDate() {
            return new Date().toISOString().split('T')[0];
        }
    },

    created() {
        // Предзаполнение из query параметров
        const serviceId = this.$route.query.serviceId;
        const doctorId = this.$route.query.doctorId;

        if (serviceId) {
            this.form.serviceId = parseInt(serviceId);
            // Найдём отделение по услуге
            const service = this.services.find(s => s.id === this.form.serviceId);
            if (service) {
                const dept = this.departments.find(d => d.name === service.departmentName);
                if (dept) this.selectedDepartmentId = dept.id;
            }
        }

        if (doctorId) {
            this.form.doctorId = parseInt(doctorId);
            // Найдём отделение по врачу
            const doctor = this.doctors.find(d => d.id === this.form.doctorId);
            if (doctor) {
                const dept = this.departments.find(d => d.name === doctor.departmentName);
                if (dept) this.selectedDepartmentId = dept.id;
            }
        }
    },

    methods: {
        formatPrice(price) {
            return Store.formatPrice(price);
        },

        onDepartmentChange() {
            // Сбрасываем выбор услуги и врача при смене отделения
            this.form.serviceId = null;
            this.form.doctorId = null;
        },

        async bookAppointment() {
            if (!this.form.serviceId || !this.form.doctorId ||
                !this.form.appointmentDate || !this.form.appointmentTime) {
                this.error = 'Пожалуйста, заполните все обязательные поля';
                return;
            }

            this.loading = true;
            this.error = null;
            this.success = null;

            try {
                await API.appointments.create({
                    serviceId: this.form.serviceId,
                    doctorId: this.form.doctorId,
                    appointmentDate: `${this.form.appointmentDate}T${this.form.appointmentTime}:00`,
                    notes: this.form.notes
                });

                this.success = 'Запись успешно создана!';
                Store.showToast('Вы успешно записаны на приём!', 'success');

                // Сбрасываем форму
                this.form = {
                    serviceId: null,
                    doctorId: null,
                    appointmentDate: '',
                    appointmentTime: null,
                    notes: ''
                };
                this.selectedDepartmentId = null;

            } catch (error) {
                console.error('Book appointment error:', error);
                this.error = error.response?.data?.message || 'Ошибка создания записи. Попробуйте позже.';
            } finally {
                this.loading = false;
            }
        }
    }
};