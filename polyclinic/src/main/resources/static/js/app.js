const { createApp } = Vue

createApp({
    data() {
        return {
            currentPage: 'home',
            departments: [],
            doctors: [],
            services: [],
            selectedDepartment: null,
            selectedSpecialization: null,
            loading: true,
            error: null,
            // Для модального окна записи
            showBookingModal: false,
            selectedService: null,
            selectedDoctor: null
        }
    },

    computed: {
        filteredServices() {
            if (!this.selectedDepartment) {
                return this.services;
            }
            return this.services.filter(s => s.departmentName === this.selectedDepartment);
        },

        filteredDoctors() {
            if (!this.selectedSpecialization) {
                return this.doctors;
            }
            return this.doctors.filter(d => d.departmentName === this.selectedSpecialization);
        }
    },

    methods: {
        async loadData() {
            this.loading = true;
            try {
                const [deptResponse, doctorsResponse, servicesResponse] = await Promise.all([
                    axios.get('/api/departments'),
                    axios.get('/api/doctors'),
                    axios.get('/api/services')
                ]);

                this.departments = deptResponse.data;
                this.doctors = doctorsResponse.data;
                this.services = servicesResponse.data;

                console.log('✅ Данные загружены:', {
                    departments: this.departments.length,
                    doctors: this.doctors.length,
                    services: this.services.length
                });
            } catch (error) {
                console.error('❌ Ошибка загрузки:', error);
                this.error = 'Не удалось загрузить данные';
            } finally {
                this.loading = false;
            }
        },

        formatPrice(price) {
            return new Intl.NumberFormat('ru-RU').format(price);
        },

        getDepartmentIcon(name) {
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
                'Дерматология': '🧴'
            };
            return icons[name] || '🏥';
        },

        // Переход на страницу услуг с выбранным фильтром
        goToServicesWithFilter(departmentName) {
            this.selectedDepartment = departmentName;
            this.currentPage = 'services';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Скролл вверх при смене страницы
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // Запись на услугу
        bookService(service) {
            window.location.href = '/appointment/book?serviceId=' + service.id;
        },

        // Запись к врачу
        bookDoctor(doctor) {
            window.location.href = '/appointment/book?doctorId=' + doctor.id;
        },

        // Сброс фильтра отделений
        clearDepartmentFilter() {
            this.selectedDepartment = null;
        },

        clearSpecializationFilter() {
            this.selectedSpecialization = null;
        }
    },

    watch: {
        // При смене страницы скроллим вверх
        currentPage() {
            this.scrollToTop();
        }
    },

    mounted() {
        this.loadData();

        // Добавляем класс при скролле для тени хедера
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }
}).mount('#app')