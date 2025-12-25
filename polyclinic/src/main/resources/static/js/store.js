// ============================================
// STORE - Глобальное состояние приложения
// ============================================

const Store = {
    // Состояние
    state: Vue.reactive({
        // Пользователь
        user: null,
        isAuthenticated: false,
        isAdmin: false,

        // Данные
        departments: [],
        doctors: [],
        services: [],

        // UI
        loading: false,
        toasts: [],

        // Фильтры
        selectedDepartment: null
    }),

    //  AUTH
    async checkAuth() {
        try {
            const user = await API.auth.getCurrentUser();
            console.log('checkAuth - получен пользователь:', user);
            this.setUser(user);
            return true;
        } catch (error) {
            console.log('checkAuth - пользователь не авторизован');
            this.logout();
            return false;
        }
    },

    setUser(user) {
        console.log('setUser вызван с:', user);

        this.state.user = user;
        this.state.isAuthenticated = !!user;

        // Проверяем все возможные варианты поля admin
        this.state.isAdmin = !!(user && (
            user.admin === true ||
            user.isAdmin === true ||
            user.role === 'ADMIN'
        ));

        console.log('Store обновлён:', {
            user: this.state.user,
            isAuthenticated: this.state.isAuthenticated,
            isAdmin: this.state.isAdmin
        });
    },

    logout() {
        console.log('logout вызван');
        this.state.user = null;
        this.state.isAuthenticated = false;
        this.state.isAdmin = false;
    },

    //  DATA
    async loadPublicData() {
        this.state.loading = true;
        try {
            const [departments, doctors, services] = await Promise.all([
                API.departments.getAll().catch(e => { console.error('Ошибка загрузки departments:', e); return []; }),
                API.doctors.getAll().catch(e => { console.error('Ошибка загрузки doctors:', e); return []; }),
                API.services.getAll().catch(e => { console.error('Ошибка загрузки services:', e); return []; })
            ]);

            this.state.departments = departments || [];
            this.state.doctors = doctors || [];
            this.state.services = services || [];

            console.log('✅ Данные загружены:', {
                departments: this.state.departments.length,
                doctors: this.state.doctors.length,
                services: this.state.services.length
            });
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
        } finally {
            this.state.loading = false;
        }
    },

    // TOASTS
    showToast(message, type = 'info', duration = 5000) {
        const id = Date.now();
        this.state.toasts.push({ id, message, type });

        setTimeout(() => {
            this.removeToast(id);
        }, duration);
    },

    removeToast(id) {
        const index = this.state.toasts.findIndex(t => t.id === id);
        if (index > -1) {
            this.state.toasts.splice(index, 1);
        }
    },

    //  HELPERS
    getDepartmentIcon(name) {
        if (!name) return '🏥';
        const icons = {
            'Терапия': '🩺',
            'Кардиология': '❤️',
            'Неврология': '🧠',
            'Офтальмология': '👁️',
            'Стоматология': '🦷',
            'Хирургия': '⚕️',
            'Педиатрия': '👶',
            'Гинекология': '🌸',
            'Урология': '💧',
            'Дерматология': '🧴',
            'ЛОР': '👂',
            'Ортопедия': '🦴',
            'Эндокринология': '🦋',
            'Гастроэнтерология': '🫃',
            'Пульмонология': '🫁'
        };
        return icons[name] || '🏥';
    },

    formatPrice(price) {
        if (price == null) return '0';
        return new Intl.NumberFormat('ru-RU').format(price);
    },

    formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

console.log(' Store загружен');