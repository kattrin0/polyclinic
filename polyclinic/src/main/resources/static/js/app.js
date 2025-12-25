const { createApp } = Vue;

// Создаём приложение
const app = createApp({
    data() {
        return {
            ready: false
        };
    },
    
    computed: {
        loading() {
            return Store.state.loading;
        },
        
        isAdminRoute() {
            return this.$route.path.startsWith('/admin');
        }
    },
    
    async created() {
        // Инициализация
        console.log('🏥 МедЦентр+ запускается...');
        
        // Проверяем авторизацию
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await Store.checkAuth();
        }
        
        // Загружаем публичные данные
        await Store.loadPublicData();
        
        this.ready = true;
        console.log('✅ МедЦентр+ готов к работе!');
    }
});

//  РЕГИСТРАЦИЯ КОМПОНЕНТОВ

// Общие компоненты
app.component('navbar-component', NavbarComponent);
app.component('footer-component', FooterComponent);
app.component('toast-container', ToastContainer);
app.component('loading-spinner', LoadingSpinner);
app.component('empty-state', EmptyState);
app.component('pagination-component', PaginationComponent);
app.component('confirm-modal', ConfirmModal);

// Админ компоненты
app.component('admin-sidebar', AdminSidebar);

app.use(router);

app.config.globalProperties.$store = Store;
app.config.globalProperties.$api = API;

app.mount('#app');