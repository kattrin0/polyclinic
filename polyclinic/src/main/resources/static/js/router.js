// ============================================
// VUE ROUTER
// ============================================

const { createRouter, createWebHistory } = VueRouter;

const routes = [
    // ПУБЛИЧНЫЕ
    { path: '/', name: 'home', component: HomePage },
    { path: '/services', name: 'services', component: ServicesPage },
    { path: '/doctors', name: 'doctors', component: DoctorsPage },

    //  АВТОРИЗАЦИЯ
    { path: '/login', name: 'login', component: LoginPage, meta: { guest: true } },
    { path: '/register', name: 'register', component: RegisterPage, meta: { guest: true } },

    //  ПОЛЬЗОВАТЕЛЬСКИЕ
    { path: '/profile', name: 'profile', component: ProfilePage, meta: { requiresAuth: true } },
    { path: '/my-appointments', name: 'my-appointments', component: MyAppointmentsPage, meta: { requiresAuth: true } },
    { path: '/book-appointment', name: 'book-appointment', component: BookAppointmentPage, meta: { requiresAuth: true } },

    //  АДМИН-ПАНЕЛЬ
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, requiresAdmin: true },
        children: [
            { path: '', name: 'admin-dashboard', component: AdminDashboard },
            { path: 'users', name: 'admin-users', component: AdminUsers },
            { path: 'doctors', name: 'admin-doctors', component: AdminDoctors },
            { path: 'services', name: 'admin-services', component: AdminServices },
            { path: 'departments', name: 'admin-departments', component: AdminDepartments },
            { path: 'appointments', name: 'admin-appointments', component: AdminAppointments }
        ]
    },

    //  404
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: {
            template: `
            <div class="container py-5 text-center">
                <i class="bi bi-emoji-frown display-1 text-muted"></i>
                <h1 class="mt-4">404</h1>
                <p class="lead text-muted">Страница не найдена</p>
                <router-link to="/" class="btn btn-primary">
                    <i class="bi bi-house me-2"></i> На главную
                </router-link>
            </div>
            `
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    }
});

//  GUARDS
router.beforeEach(async (to, from, next) => {
    if (Store.state.user === null && document.cookie.includes('JSESSIONID')) {
        await Store.checkAuth();
    }

    const isAuthenticated = Store.state.isAuthenticated;
    const isAdmin = Store.state.isAdmin;

    if (to.meta.requiresAuth && !isAuthenticated) {
        Store.showToast('Для доступа необходимо авторизоваться', 'warning');
        return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    if (to.meta.requiresAdmin && !isAdmin) {
        Store.showToast('Доступ запрещён', 'error');
        return next('/');
    }

    if (to.meta.guest && isAuthenticated) {
        return next('/');
    }

    next();
});

console.log(' router.js загружен');