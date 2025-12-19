// ============================================
// СТРАНИЦЫ АВТОРИЗАЦИИ
// ============================================

// ==================== LOGIN PAGE ====================
const LoginPage = {
    template: `
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-header">
                <div class="logo-icon-lg">
                    <i class="bi bi-hospital"></i>
                </div>
                <h3 class="mb-0">МедЦентр+</h3>
                <p class="mb-0 opacity-75">Вход в личный кабинет</p>
            </div>
            <div class="auth-body">
                <!-- Сообщения -->
                <div v-if="error" class="alert alert-danger">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    {{ error }}
                </div>
                <div v-if="successMessage" class="alert alert-success">
                    <i class="bi bi-check-circle me-2"></i>
                    {{ successMessage }}
                </div>

                <!-- Форма входа -->
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                            <input type="email" v-model="form.email" class="form-control"
                                   placeholder="Введите email" required :disabled="loading">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="form-label fw-semibold">Пароль</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-lock"></i></span>
                            <input :type="showPassword ? 'text' : 'password'"
                                   v-model="form.password" class="form-control"
                                   placeholder="Введите пароль" required :disabled="loading">
                            <button type="button" class="btn btn-outline-secondary"
                                    @click="showPassword = !showPassword">
                                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                            </button>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-auth w-100 mb-3" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                        {{ loading ? 'Вход...' : 'Войти' }}
                    </button>
                </form>

                <hr class="my-4">

                <p class="text-center mb-0">
                    Нет аккаунта?
                    <router-link to="/register" class="text-decoration-none fw-semibold">
                        Зарегистрироваться
                    </router-link>
                </p>
                <p class="text-center mt-3">
                    <router-link to="/" class="text-muted text-decoration-none">
                        <i class="bi bi-arrow-left me-1"></i> На главную
                    </router-link>
                </p>
            </div>
        </div>
    </div>
    `,

    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            loading: false,
            error: null,
            successMessage: null,
            showPassword: false
        };
    },

    created() {
        // Проверяем сообщение об успешной регистрации
        if (this.$route.query.registered) {
            this.successMessage = 'Регистрация успешна! Теперь вы можете войти.';
        }
    },

    methods: {
        async login() {
            this.loading = true;
            this.error = null;

            try {
                console.log('Попытка входа:', this.form.email);

                const response = await API.auth.login(this.form.email, this.form.password);
                console.log('Ответ сервера:', response);

                if (response.user) {
                    // Устанавливаем пользователя в Store
                    Store.setUser(response.user);

                    console.log('Пользователь установлен:', Store.state.user);
                    console.log('isAuthenticated:', Store.state.isAuthenticated);
                    console.log('isAdmin:', Store.state.isAdmin);

                    Store.showToast('Добро пожаловать, ' + response.user.fullName + '!', 'success');

                    // Редирект
                    const redirect = this.$route.query.redirect || '/';
                    this.$router.push(redirect);
                } else {
                    this.error = response.message || 'Ошибка входа';
                }

            } catch (error) {
                console.error('Login error:', error);
                this.error = error.response?.data?.message || 'Неверный email или пароль';
            } finally {
                this.loading = false;
            }
        }
    }
};

// ==================== REGISTER PAGE ====================
const RegisterPage = {
    template: `
    <div class="auth-page">
        <div class="auth-card">
            <div class="auth-header">
                <div class="logo-icon-lg">
                    <i class="bi bi-hospital"></i>
                </div>
                <h3 class="mb-0">МедЦентр+</h3>
                <p class="mb-0 opacity-75">Создание аккаунта</p>
            </div>
            <div class="auth-body">
                <!-- Сообщение об ошибке -->
                <div v-if="error" class="alert alert-danger">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    {{ error }}
                </div>

                <!-- Форма регистрации -->
                <form @submit.prevent="register">
                    <!-- ФИО -->
                    <div class="mb-3">
                        <label class="form-label fw-semibold">ФИО</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                            <input type="text" v-model="form.fullName" class="form-control"
                                   :class="{ 'is-invalid': errors.fullName }"
                                   placeholder="Иванов Иван Иванович" required :disabled="loading">
                        </div>
                        <div v-if="errors.fullName" class="text-danger small mt-1">
                            {{ errors.fullName }}
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                            <input type="email" v-model="form.email" class="form-control"
                                   :class="{ 'is-invalid': errors.email }"
                                   placeholder="example@mail.ru" required :disabled="loading">
                        </div>
                        <div v-if="errors.email" class="text-danger small mt-1">
                            {{ errors.email }}
                        </div>
                    </div>

                    <!-- Телефон -->
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Телефон</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                            <input type="tel" v-model="form.phone" class="form-control"
                                   :class="{ 'is-invalid': errors.phone }"
                                   placeholder="+7 (999) 123-45-67" :disabled="loading">
                        </div>
                        <div v-if="errors.phone" class="text-danger small mt-1">
                            {{ errors.phone }}
                        </div>
                    </div>

                    <!-- Пароль -->
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Пароль</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-lock"></i></span>
                            <input :type="showPassword ? 'text' : 'password'"
                                   v-model="form.password" class="form-control"
                                   :class="{ 'is-invalid': errors.password }"
                                   placeholder="Минимум 6 символов" required :disabled="loading">
                            <button type="button" class="btn btn-outline-secondary"
                                    @click="showPassword = !showPassword">
                                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                            </button>
                        </div>
                        <div v-if="errors.password" class="text-danger small mt-1">
                            {{ errors.password }}
                        </div>
                    </div>

                    <!-- Подтверждение пароля -->
                    <div class="mb-4">
                        <label class="form-label fw-semibold">Подтвердите пароль</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                            <input :type="showPassword ? 'text' : 'password'"
                                   v-model="form.confirmPassword" class="form-control"
                                   :class="{ 'is-invalid': errors.confirmPassword }"
                                   placeholder="Повторите пароль" required :disabled="loading">
                        </div>
                        <div v-if="errors.confirmPassword" class="text-danger small mt-1">
                            {{ errors.confirmPassword }}
                        </div>
                    </div>

                    <button type="submit" class="btn btn-auth w-100 mb-3" :disabled="loading">
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        <i v-else class="bi bi-person-plus me-2"></i>
                        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
                    </button>
                </form>

                <hr class="my-4">

                <p class="text-center mb-0">
                    Уже есть аккаунт?
                    <router-link to="/login" class="text-decoration-none fw-semibold">Войти</router-link>
                </p>
                <p class="text-center mt-3">
                    <router-link to="/" class="text-muted text-decoration-none">
                        <i class="bi bi-arrow-left me-1"></i> На главную
                    </router-link>
                </p>
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
                password: '',
                confirmPassword: ''
            },
            errors: {},
            loading: false,
            error: null,
            showPassword: false
        };
    },

    methods: {
        validate() {
            this.errors = {};

            if (!this.form.fullName || this.form.fullName.length < 2) {
                this.errors.fullName = 'Введите ФИО (минимум 2 символа)';
            }

            if (!this.form.email || !this.form.email.includes('@')) {
                this.errors.email = 'Введите корректный email';
            }

            if (!this.form.password || this.form.password.length < 6) {
                this.errors.password = 'Пароль должен содержать минимум 6 символов';
            }

            if (this.form.password !== this.form.confirmPassword) {
                this.errors.confirmPassword = 'Пароли не совпадают';
            }

            return Object.keys(this.errors).length === 0;
        },

        async register() {
            if (!this.validate()) return;

            this.loading = true;
            this.error = null;

            try {
                console.log('Регистрация:', this.form);

                await API.auth.register({
                    fullName: this.form.fullName,
                    email: this.form.email,
                    phone: this.form.phone || '',
                    password: this.form.password,
                    confirmPassword: this.form.confirmPassword
                });

                Store.showToast('Регистрация успешна! Теперь войдите в систему.', 'success');
                this.$router.push('/login?registered=true');

            } catch (error) {
                console.error('Register error:', error);
                this.error = error.response?.data?.message || 'Ошибка регистрации. Попробуйте позже.';
            } finally {
                this.loading = false;
            }
        }
    }
};

console.log('✅ pages-auth.js загружен');