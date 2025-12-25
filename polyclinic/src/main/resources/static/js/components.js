// ============================================
// ОБЩИЕ КОМПОНЕНТЫ
// ============================================

// ==================== NAVBAR ====================
const NavbarComponent = {
    template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
        <div class="container">
            <router-link class="navbar-brand d-flex align-items-center" to="/">
                <div class="logo-icon me-2">
                    <i class="bi bi-hospital"></i>
                </div>
                <span class="fw-bold text-primary">МедЦентр+</span>
            </router-link>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mx-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/" exact-active-class="active">
                            <i class="bi bi-house me-1"></i> Главная
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/services" active-class="active">
                            <i class="bi bi-list-check me-1"></i> Услуги
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/doctors" active-class="active">
                            <i class="bi bi-people me-1"></i> Врачи
                        </router-link>
                    </li>

                </ul>

                <!-- Кнопки авторизации -->
                <div class="d-flex gap-2 align-items-center">
                    <!-- Для НЕавторизованных -->
                    <template v-if="!isAuthenticated">
                        <router-link to="/login" class="btn btn-outline-primary">
                            <i class="bi bi-box-arrow-in-right me-1"></i> Войти
                        </router-link>
                        <router-link to="/register" class="btn btn-primary">
                            <i class="bi bi-person-plus me-1"></i> Регистрация
                        </router-link>
                    </template>

                    <!-- Для авторизованных -->
                    <template v-else>
                        <div class="dropdown">
                            <button class="btn btn-outline-primary dropdown-toggle" type="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-person-circle me-1"></i>
                                {{ user?.fullName || 'Профиль' }}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <router-link class="dropdown-item" to="/profile">
                                        <i class="bi bi-person me-2"></i>Мой профиль
                                    </router-link>
                                </li>
                                <li>
                                    <router-link class="dropdown-item" to="/my-appointments">
                                        <i class="bi bi-calendar-check me-2"></i>Мои записи
                                    </router-link>
                                </li>
                                <!-- Только для админа -->
                                <template v-if="isAdmin">
                                    <li><hr class="dropdown-divider"></li>
                                    <li>
                                        <router-link class="dropdown-item text-primary" to="/admin">
                                            <i class="bi bi-gear me-2"></i>Админ-панель
                                        </router-link>
                                    </li>
                                </template>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                                        <i class="bi bi-box-arrow-left me-2"></i>Выход
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </nav>
    `,

    computed: {
        isAuthenticated() {
            return Store.state.isAuthenticated;
        },
        isAdmin() {
            return Store.state.isAdmin;
        },
        user() {
            return Store.state.user;
        }
    },

    methods: {
        async logout() {
            try {
                await API.auth.logout();
            } catch (e) {
                // Игнорируем ошибку
            }
            Store.logout();
            this.$router.push('/');
            Store.showToast('Вы вышли из системы', 'info');
        }
    }
};

// ==================== FOOTER ====================
const FooterComponent = {
    template: `
    <footer class="bg-dark text-white py-5 mt-auto">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4">
                    <div class="d-flex align-items-center mb-3">
                        <div class="logo-icon bg-primary me-2">
                            <i class="bi bi-hospital"></i>
                        </div>
                        <span class="fs-4 fw-bold">МедЦентр+</span>
                    </div>
                    <p class="text-white-50">
                        Современная многопрофильная клиника с передовыми методами диагностики и лечения.

                    </p>

                </div>
                <div class="col-6 col-lg-2">
                    <h6 class="fw-bold mb-3">Навигация</h6>
                    <ul class="list-unstyled">
                        <li class="mb-2"><router-link to="/" class="text-white-50 text-decoration-none">Главная</router-link></li>
                        <li class="mb-2"><router-link to="/services" class="text-white-50 text-decoration-none">Услуги</router-link></li>
                        <li class="mb-2"><router-link to="/doctors" class="text-white-50 text-decoration-none">Врачи</router-link></li>
                    </ul>
                </div>
                <div class="col-6 col-lg-2">
                    <h6 class="fw-bold mb-3">Услуги</h6>
                    <ul class="list-unstyled">
                        <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Терапия</a></li>
                        <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Кардиология</a></li>
                        <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Неврология</a></li>
                        <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Стоматология</a></li>
                    </ul>
                </div>
                <div class="col-lg-4">
                    <h6 class="fw-bold mb-3">Контакты</h6>
                    <ul class="list-unstyled text-white-50">
                        <li class="mb-2"><i class="bi bi-telephone me-2"></i> +7 (495) 123-45-67</li>
                        <li class="mb-2"><i class="bi bi-envelope me-2"></i> info@medcenter.ru</li>
                        <li class="mb-2"><i class="bi bi-geo-alt me-2"></i> г. Воронеж, ул. Олимпийская, 123</li>

                    </ul>
                </div>
            </div>
            <hr class="my-4 border-secondary">
            <div class="row align-items-center">
                <div class="col-md-6 text-center text-md-start">
                    <small class="text-white-50">© 2025 МедЦентр+. Все права защищены.</small>
                </div>
                <div class="col-md-6 text-center text-md-end mt-3 mt-md-0">
                    <a href="#" class="text-white-50 text-decoration-none small me-3">Политика конфиденциальности</a>
                    <a href="#" class="text-white-50 text-decoration-none small">Условия использования</a>
                </div>
            </div>
        </div>
    </footer>
    `
};

// ==================== TOAST CONTAINER ====================
const ToastContainer = {
    template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
        <div v-for="toast in toasts" :key="toast.id"
             class="toast show" role="alert"
             :class="toastClass(toast.type)">
            <div class="toast-header">
                <i :class="toastIcon(toast.type)" class="me-2"></i>
                <strong class="me-auto">{{ toastTitle(toast.type) }}</strong>
                <button type="button" class="btn-close" @click="removeToast(toast.id)"></button>
            </div>
            <div class="toast-body">
                {{ toast.message }}
            </div>
        </div>
    </div>
    `,

    computed: {
        toasts() {
            return Store.state.toasts;
        }
    },

    methods: {
        removeToast(id) {
            Store.removeToast(id);
        },

        toastClass(type) {
            const classes = {
                success: 'border-success',
                error: 'border-danger',
                warning: 'border-warning',
                info: 'border-primary'
            };
            return classes[type] || classes.info;
        },

        toastIcon(type) {
            const icons = {
                success: 'bi bi-check-circle-fill text-success',
                error: 'bi bi-exclamation-circle-fill text-danger',
                warning: 'bi bi-exclamation-triangle-fill text-warning',
                info: 'bi bi-info-circle-fill text-primary'
            };
            return icons[type] || icons.info;
        },

        toastTitle(type) {
            const titles = {
                success: 'Успешно',
                error: 'Ошибка',
                warning: 'Внимание',
                info: 'Информация'
            };
            return titles[type] || titles.info;
        }
    }
};

// ==================== LOADING SPINNER ====================
const LoadingSpinner = {
    template: `
    <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
        </div>
        <p class="mt-3 text-muted">{{ message }}</p>
    </div>
    `,
    props: {
        message: {
            type: String,
            default: 'Загрузка...'
        }
    }
};

// ==================== EMPTY STATE ====================
const EmptyState = {
    template: `
    <div class="text-center py-5">
        <i :class="icon" class="display-1 text-muted"></i>
        <h4 class="mt-3">{{ title }}</h4>
        <p class="text-muted">{{ description }}</p>
        <slot name="action"></slot>
    </div>
    `,
    props: {
        icon: { type: String, default: 'bi bi-inbox' },
        title: { type: String, default: 'Ничего не найдено' },
        description: { type: String, default: '' }
    }
};

// ==================== PAGINATION ====================
const PaginationComponent = {
    template: `
    <nav v-if="totalPages > 1" aria-label="Навигация по страницам">
        <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
                <a class="page-link" href="#" @click.prevent="goToPage(0)">
                    <i class="bi bi-chevron-double-left"></i>
                </a>
            </li>
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
            <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
                <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
                <a class="page-link" href="#" @click.prevent="goToPage(totalPages - 1)">
                    <i class="bi bi-chevron-double-right"></i>
                </a>
            </li>
        </ul>
    </nav>
    `,
    props: {
        currentPage: { type: Number, required: true },
        totalPages: { type: Number, required: true }
    },
    computed: {
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
    methods: {
        goToPage(page) {
            if (page >= 0 && page < this.totalPages) {
                this.$emit('page-change', page);
            }
        }
    }
};

// ==================== CONFIRM MODAL ====================
const ConfirmModal = {
    template: `
    <div class="modal fade" :id="modalId" tabindex="-1" ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>{{ message }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ cancelText }}</button>
                    <button type="button" class="btn" :class="'btn-' + type" @click="confirm">{{ confirmText }}</button>
                </div>
            </div>
        </div>
    </div>
    `,
    props: {
        modalId: { type: String, default: 'confirmModal' },
        title: { type: String, default: 'Подтверждение' },
        message: { type: String, default: 'Вы уверены?' },
        type: { type: String, default: 'danger' },
        confirmText: { type: String, default: 'Подтвердить' },
        cancelText: { type: String, default: 'Отмена' }
    },
    methods: {
        confirm() {
            this.$emit('confirm');
            bootstrap.Modal.getInstance(this.$refs.modal).hide();
        }
    }
};

console.log('✅ components.js загружен');