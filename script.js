document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // Smart Sticky Header + Scroll Progress
    // ========================================
    const header = document.querySelector('.header');
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollWave = document.querySelector('.scroll-progress__wave');
    const scrollSup = document.getElementById('scrollSup');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((currentScrollY / docHeight) * 100, 100);

        // Update scroll progress bar
        if (scrollProgress && scrollWave && scrollSup) {
            if (currentScrollY > 100) {
                scrollProgress.classList.add('scroll-progress--visible');
            } else {
                scrollProgress.classList.remove('scroll-progress--visible');
            }
            scrollWave.style.width = scrollPercent + '%';
            scrollSup.style.left = scrollPercent + '%';
        }

        // Add/remove scrolled class for background change
        if (currentScrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        // Hide/show header based on scroll direction (only after passing hero)
        let headerVisible = true;
        if (currentScrollY > heroHeight) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling DOWN
                header.classList.add('header--hidden');
                headerVisible = false;
            } else {
                // Scrolling UP
                header.classList.remove('header--hidden');
                headerVisible = true;
            }
        } else {
            header.classList.remove('header--hidden');
            headerVisible = true;
        }

        // Sync progress bar position with header
        if (scrollProgress) {
            if (headerVisible) {
                scrollProgress.classList.add('scroll-progress--header-visible');
            } else {
                scrollProgress.classList.remove('scroll-progress--header-visible');
            }
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ========================================
    // Modal Logic
    // ========================================

    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalOverlay = document.getElementById('closeModalOverlay');
    const modal = document.getElementById('bookingModal');

    // Detail Modals
    const equipModal = document.getElementById('equipDetailModal');
    const tourModal = document.getElementById('tourDetailModal');
    const detailCloseBtns = document.querySelectorAll('.js-close-detail-modal');

    // Data Dictionaries for Modals — Реальные данные с Яндекс Карт (Водник, Липецк)
    const equipmentData = {
        // ========== САПБОРДЫ ==========
        'sup_arctic': {
            title: 'JS 335 Arctic',
            img: 'assets/equip/sup_arctic.jpg',
            desc: 'Универсальная модель 335×81×15 см, до 200 кг. Подходит для новичков и пар. Устойчивый корпус с тремя плавниками.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '335×81×15 см' },
                { label: 'Грузоподъемность', value: 'до 200 кг' },
                { label: 'Плавники', value: '3 шт' },
                { label: 'Уровень', value: 'Для всех' }
            ]
        },
        'sup_rq335': {
            title: 'JS RQ335',
            img: 'assets/equip/sup_rq335.jpg',
            desc: 'Устойчивая платформа с одним плавником 335×82×15 см. Отличный выбор для спокойных прогулок.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '335×82×15 см' },
                { label: 'Плавник', value: '1 шт (большой)' },
                { label: 'Тип', value: 'All-round' },
                { label: 'Уровень', value: 'Для всех' }
            ]
        },
        'sup_ninja': {
            title: 'JS Ninja 335',
            img: 'assets/equip/sup_ninja.jpg',
            desc: 'Для разных стилей катания, прогулок и легкого фитнеса. Универсальная и послушная доска.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '335×81×15 см' },
                { label: 'Стиль', value: 'Универсальный' },
                { label: 'Подходит', value: 'Прогулки, фитнес' },
                { label: 'Уровень', value: 'Для всех' }
            ]
        },
        'sup_guns_roses': {
            title: 'Fayean Guns & Roses 10\'6',
            img: 'assets/equip/sup_guns_roses.jpg',
            desc: 'Стильная и маневренная доска 320×83×15 см с три плавниками. Компактная, легко управляется.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '320×83×15 см' },
                { label: 'Плавники', value: '3 шт' },
                { label: 'Тип', value: 'All-round' },
                { label: 'Уровень', value: 'Новичок / Любитель' }
            ]
        },
        'sup_koi': {
            title: 'Fayean Koi 11\'6',
            img: 'assets/equip/sup_koi.jpg',
            desc: 'Длинная доска (350 см) для открытой воды и волн. Объем 290 л, давление до 20 psi. Для дальних маршрутов.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '350×76×15 см' },
                { label: 'Объем', value: '290 л' },
                { label: 'Давление', value: 'до 20 psi' },
                { label: 'Тип', value: 'Touring' }
            ]
        },
        'sup_monkey': {
            title: 'My SUP 11\'6 Monkey',
            img: 'assets/equip/sup_monkey.jpg',
            desc: 'Туринговая доска для дальних прогулок и скорости. Размер 350×76×15 см, объем 290 л.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '350×76×15 см' },
                { label: 'Объем', value: '290 л' },
                { label: 'Тип', value: 'Touring' },
                { label: 'Уровень', value: 'Средний / Продвинутый' }
            ]
        },
        'sup_duo': {
            title: 'Compact DUO 340',
            img: 'assets/equip/sup_duo.jpg',
            desc: 'Прочная доска для двоих (взрослый + ребенок или пара). Размер 340×83×15 см, объем 330 л.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '340×83×15 см' },
                { label: 'Объем', value: '330 л' },
                { label: 'Вместимость', value: '2 человека' },
                { label: 'Тип', value: 'Tandem' }
            ]
        },
        'sup_yoga': {
            title: 'YogiPad 330 (Йога)',
            img: 'assets/equip/sup_yoga.jpg',
            desc: 'Широкая (85 см) и устойчивая платформа 330×85×15 см. Идеально для SUP-йоги и медитации на воде. Вес 9 кг.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '330×85×15 см' },
                { label: 'Вес', value: '9 кг' },
                { label: 'Ширина', value: '85 см (макс.)' },
                { label: 'Тип', value: 'Yoga / Fitness' }
            ]
        },
        'sup_kids': {
            title: 'MiniBoard 240 (Детский)',
            img: 'assets/equip/sup_kids.jpg',
            desc: 'Компактная и легкая доска для детей 5-12 лет. Размер 240×65×12 см, до 60 кг.',
            price: '400 ₽/час',
            specs: [
                { label: 'Размер', value: '240×65×12 см' },
                { label: 'Грузоподъемность', value: 'до 60 кг' },
                { label: 'Возраст', value: '5-12 лет' },
                { label: 'Тип', value: 'Kids' }
            ]
        },
        'sup_easy': {
            title: 'Easy Paddle 305',
            img: 'assets/equip/sup_easy.jpg',
            desc: 'Легкая и простая в управлении доска. Размер 305×76×15 см, вес всего 7.5 кг.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '305×76×15 см' },
                { label: 'Вес', value: '7.5 кг' },
                { label: 'Тип', value: 'Легкий старт' },
                { label: 'Уровень', value: 'Новичок' }
            ]
        },
        'sup_standard': {
            title: 'Ride Standard 320',
            img: 'assets/equip/sup_standard.jpg',
            desc: 'Классический формат для всех уровней подготовки. Размер 320×80×15 см, объем 290 л.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '320×80×15 см' },
                { label: 'Объем', value: '290 л' },
                { label: 'Тип', value: 'All-round' },
                { label: 'Уровень', value: 'Для всех' }
            ]
        },
        'sup_powerflow': {
            title: 'Power Flow 335',
            img: 'assets/equip/sup_powerflow.jpg',
            desc: 'Устойчивый корпус для уверенного катания. Размер 335×81×15 см, объем 326 л. Один плавник.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '335×81×15 см' },
                { label: 'Объем', value: '326 л' },
                { label: 'Плавник', value: '1 шт' },
                { label: 'Тип', value: 'All-round' }
            ]
        },
        'sup_softride': {
            title: 'SoftRide 11\'',
            img: 'assets/equip/sup_softride.jpg',
            desc: 'Доска 350×76×15 см с объемом 290 л и тремя плавниками. Максимальный ход и объем для долгих маршрутов.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '350×76×15 см' },
                { label: 'Объем', value: '290 л' },
                { label: 'Плавники', value: '3 шт' },
                { label: 'Тип', value: 'Touring' }
            ]
        },
        // ========== БАЙДАРКИ ==========
        'baidarka_3': {
            title: 'Байдарка 3-местная',
            img: 'assets/equip/baidarka_3.jpg',
            desc: 'Вместительная трехместная байдарка. В стоимость входит аренда байдарки, весла и спасжилета. В наличии 10 штук.',
            price: '900 ₽/час',
            specs: [
                { label: 'Вместимость', value: '3 человека' },
                { label: 'В наличии', value: '10 шт' },
                { label: 'Включено', value: 'Весла + жилеты' },
                { label: 'Тип', value: 'Байдарка' }
            ]
        },
        'baidarka_karkas': {
            title: 'Байдарка каркасная',
            img: 'assets/equip/baidarka_karkas.jpg',
            desc: 'Каркасная байдарка для настоящих ценителей сплавов. В стоимость входит аренда байдарки, весла и спасжилета.',
            price: '900 ₽/час',
            specs: [
                { label: 'Тип', value: 'Каркасная' },
                { label: 'В наличии', value: '1 шт' },
                { label: 'Включено', value: 'Весла + жилеты' },
                { label: 'Особенность', value: 'Классика' }
            ]
        },
        'baidarka_karkas_2': {
            title: 'Байдарка каркасная 2-местная',
            img: 'assets/equip/baidarka_karkas_2.jpg',
            desc: 'Каркасная двухместная байдарка. В стоимость входит аренда байдарки, весла и спасжилета. В наличии 4 штуки.',
            price: '700 ₽/час',
            specs: [
                { label: 'Вместимость', value: '2 человека' },
                { label: 'Тип', value: 'Каркасная' },
                { label: 'В наличии', value: '4 шт' },
                { label: 'Включено', value: 'Весла + жилеты' }
            ]
        },
        // ========== КАЯКИ ==========
        'kayak_1': {
            title: 'Каяк 1-местный',
            img: 'assets/equip/kayak_1.jpg',
            desc: 'Одноместный каяк для самостоятельных исследований реки. В наличии 17 штук.',
            price: '500 ₽/час',
            specs: [
                { label: 'Вместимость', value: '1 человек' },
                { label: 'В наличии', value: '17 шт' },
                { label: 'Включено', value: 'Весло + жилет' },
                { label: 'Тип', value: 'Sit-in' }
            ]
        },
        'kayak_2': {
            title: 'Каяк 2-местный',
            img: 'assets/equip/kayak_2.jpg',
            desc: 'Двухместный каяк для парного катания. В наличии 11 штук.',
            price: '700 ₽/час',
            specs: [
                { label: 'Вместимость', value: '2 человека' },
                { label: 'В наличии', value: '11 шт' },
                { label: 'Включено', value: 'Весла + жилеты' },
                { label: 'Тип', value: 'Sit-in' }
            ]
        },
        'kayak_3': {
            title: 'Каяк 3-местный',
            img: 'assets/equip/kayak_3.jpg',
            desc: 'Трёхместный семейный каяк. Идеально для двух взрослых и ребенка. В наличии 4 штуки.',
            price: '900 ₽/час',
            specs: [
                { label: 'Вместимость', value: '2 взр. + 1 реб.' },
                { label: 'В наличии', value: '4 шт' },
                { label: 'Включено', value: 'Весла + жилеты' },
                { label: 'Тип', value: 'Sit-on-top' }
            ]
        },
        // ========== ФОТОСЕССИИ ==========
        'photo_lite': {
            title: 'Фотосессия Lite',
            img: 'assets/equip/photo_lite.jpg',
            desc: 'Пакет Лайт: 10 профессиональных фото с обработкой. Съемка на воде или на берегу.',
            price: '3 000 ₽',
            specs: [
                { label: 'Кол-во фото', value: '10 шт' },
                { label: 'Обработка', value: 'Включена' },
                { label: 'Формат', value: 'Цифровые файлы' },
                { label: 'Локация', value: 'На воде / берег' }
            ]
        },
        'photo_full': {
            title: 'Фотосессия',
            img: 'assets/equip/photo_full.jpg',
            desc: 'Расширенный пакет: 20 профессиональных фото с обработкой. Полноценная фотосессия на воде.',
            price: '4 000 ₽',
            specs: [
                { label: 'Кол-во фото', value: '20 шт' },
                { label: 'Обработка', value: 'Включена' },
                { label: 'Формат', value: 'Цифровые файлы' },
                { label: 'Локация', value: 'На воде / берег' }
            ]
        }
    };

    const toursData = {
        'sunset': {
            title: 'Городской закат',
            time: '1.5 часа',
            desc: 'Расслабляющая вечерняя прогулка по акватории реки Воронеж в черте города. Мы проплывем под Петровским мостом, полюбуемся огнями набережной и встретим потрясающий закат прямо на воде. Идеально для первого знакомства с сапбордингом и романтических свиданий.',
            specs: [
                { label: 'Сложность', value: 'Легкая (для новичков)' },
                { label: 'Протяженность', value: '3 км' },
                { label: 'Старт', value: 'Центральный пляж' },
                { label: 'Формат', value: 'Закат с инструктором' }
            ]
        },
        'krivets': {
            title: 'Дикий Кривец',
            time: '3-4 часа',
            desc: 'Живописный маршрут по извилистому руслу реки. Нависающие деревья создают зеленые тоннели, а отсутствие городского шума позволяет полностью слиться с природой. В середине пути делаем привал на диком песчаном берегу с пикником и горячим чаем.',
            specs: [
                { label: 'Сложность', value: 'Средняя (базовый опыт)' },
                { label: 'Протяженность', value: '8 км' },
                { label: 'Трансфер', value: 'Предоставляется' },
                { label: 'Включено', value: 'Пикник, фотосъемка' }
            ]
        },
        'sputnik': {
            title: 'Экспедиция Спутник',
            time: '6 часов',
            desc: 'Настоящее приключение для тех, кто хочет испытать себя! Длинный и разнообразный маршрут, который начинается за городом и проходит через множество живописных локаций, заводи и острова. Полноценный поход одного дня на сапах.',
            specs: [
                { label: 'Сложность', value: 'Высокая (нужна выносливость)' },
                { label: 'Протяженность', value: '15+ км' },
                { label: 'Трансфер', value: 'Предоставляется' },
                { label: 'Включено', value: 'Горячий обед на костре' }
            ]
        }
    };

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        if (equipModal) equipModal.classList.remove('active');
        if (tourModal) tourModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openDetailModal(modalElement) {
        if (!modalElement) return;
        modalElement.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Unified Modal Open Logic
    document.addEventListener('click', (e) => {
        // Equipment Modal
        const equipCard = e.target.closest('.js-open-equip-modal');
        if (equipCard) {
            // Check if user clicked inside the controls (qty, standard selects, etc.)
            const isControlClick = e.target.closest('.booking__qty-wrap, .booking__duration-select, .booking__custom-date');
            
            if (!isControlClick && equipModal) {
                const equipId = equipCard.dataset.equipId;
                const data = equipmentData[equipId];
                
                if (data) {
                    document.getElementById('equipModalTitle').textContent = data.title;
                    document.getElementById('equipModalDesc').textContent = data.desc;
                    document.getElementById('equipModalImg').src = data.img;
                    
                    // Show price if available
                    const priceEl = document.getElementById('equipModalPrice');
                    if (priceEl && data.price) {
                        priceEl.textContent = data.price;
                        priceEl.style.display = '';
                    }
                    
                    const specsContainer = document.getElementById('equipModalSpecs');
                    specsContainer.innerHTML = '';
                    data.specs.forEach(spec => {
                        specsContainer.innerHTML += `<li><strong>${spec.label}</strong><span>${spec.value}</span></li>`;
                    });
                    
                    openDetailModal(equipModal);
                }
                return; // Stop execution
            }
        }

        // Tour Modal
        const tourCard = e.target.closest('.js-open-tour-modal');
        if (tourCard && tourModal) {
            const tourId = tourCard.dataset.tourId;
            const data = toursData[tourId];
            
            if (data) {
                document.getElementById('tourModalTitle').textContent = data.title;
                document.getElementById('tourModalTime').textContent = data.time;
                document.getElementById('tourModalDesc').textContent = data.desc;
                
                const specsContainer = document.getElementById('tourModalSpecs');
                specsContainer.innerHTML = '';
                data.specs.forEach(spec => {
                    specsContainer.innerHTML += `<li><strong>${spec.label}</strong><span>${spec.value}</span></li>`;
                });
                
                // Yandex Map Placeholder text update (optional, usually static until iFrame is added)
                // const mapContainer = document.getElementById('tourYandexMapContainer');
                
                openDetailModal(tourModal);
            }
            return;
        }

        // Standard Modal (.js-open-modal)
        const btn = e.target.closest('.js-open-modal');
        if (btn && !e.target.closest('.js-open-equip-modal') && !e.target.closest('.js-open-tour-modal')) {
            e.preventDefault();
            openModal();
        }
    });

    // Close logic for all detail modals
    detailCloseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target === btn) closeModal(); // Ensure we don't close if clicking modal content
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeModalOverlay) closeModalOverlay.addEventListener('click', closeModal);

    // ========================================
    // Smooth Scroll for Anchors
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // FAQ Accordion
    // ========================================
    document.querySelectorAll('.faq__question').forEach(question => {
        question.addEventListener('click', function () {
            const item = this.closest('.faq__item');
            const isActive = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq__item').forEach(i => {
                i.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ========================================
    // Equipment Show More
    // ========================================
    const equipmentShowMore = document.getElementById('showMoreEquipment');
    const equipmentGrid = document.getElementById('equipmentGrid');

    if (equipmentShowMore && equipmentGrid) {
        equipmentShowMore.addEventListener('click', function () {
            equipmentGrid.classList.toggle('expanded');
            this.classList.toggle('active');

            const textSpan = this.querySelector('.equipment__show-more-text');
            if (equipmentGrid.classList.contains('expanded')) {
                textSpan.textContent = 'Свернуть';
            } else {
                textSpan.textContent = 'Показать ещё';
            }
        });
    }

    // ========================================
    // Scenarios Show More
    // ========================================
    const scenariosShowMore = document.getElementById('showMoreScenarios');
    const scenariosGrid = document.getElementById('scenariosGrid');

    if (scenariosShowMore && scenariosGrid) {
        scenariosShowMore.addEventListener('click', function () {
            scenariosGrid.classList.toggle('expanded');
            this.classList.toggle('active');

            const textSpan = this.querySelector('.scenarios__show-more-text');
            if (scenariosGrid.classList.contains('expanded')) {
                textSpan.textContent = 'Свернуть';
            } else {
                textSpan.textContent = 'Ещё сценарии';
            }
        });
    }

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileLinks = document.querySelectorAll('.header__mobile-link');

    function toggleMobileMenu() {
        burger.classList.toggle('header__burger--open');
        mobileMenu.classList.toggle('header__mobile-menu--open');
        document.body.style.overflow = mobileMenu.classList.contains('header__mobile-menu--open') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        burger.classList.remove('header__burger--open');
        mobileMenu.classList.remove('header__mobile-menu--open');
        document.body.style.overflow = '';
    }

    if (burger && mobileMenu) {
        burger.addEventListener('click', toggleMobileMenu);

        // Close button
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // ========================================
    // Scroll Spy (Active Navigation Link)
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link');
    const mobileNavLinks = document.querySelectorAll('.header__mobile-link');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Update desktop nav
                navLinks.forEach(link => {
                    link.classList.remove('header__link--active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('header__link--active');
                    }
                });

                // Update mobile nav
                mobileNavLinks.forEach(link => {
                    link.classList.remove('header__mobile-link--active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('header__mobile-link--active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ========================================
    // Scroll Reveal Animations
    // ========================================
    const revealElements = document.querySelectorAll('.routes, .yoga, .corporate, .gallery, .faq, .booking, .equipment, .scenarios, .journey');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // ========================================
    // Gallery Polaroid Stacked Fanning Scroll
    // ========================================
    const gallerySection = document.getElementById('gallery');
    const galleryHeader = document.getElementById('galleryHeader');
    const galleryStackedCards = document.getElementById('galleryStackedCards');
    
    if (gallerySection && galleryStackedCards) {
        const polaroids = galleryStackedCards.querySelectorAll('.gallery__polaroid');
        const numCards = polaroids.length;
        
        polaroids.forEach((card, index) => {
            // Higher z-index for lower index (first card on top)
            card.style.zIndex = numCards - index;
            
            const baseRot = (Math.random() - 0.5) * 6;
            card.dataset.baserot = baseRot;
        });
        
        // Dynamically adjust gallery container height for perfectly smooth 1:1 horizontal scroll feeling
        const updateGalleryHeight = () => {
            if (window.innerWidth > 768) {
                // Determine horizontal distance
                const trackWidth = galleryStackedCards.scrollWidth - window.innerWidth;
                gallerySection.style.height = `calc(100vh + ${trackWidth}px)`;
            } else {
                gallerySection.style.height = 'auto'; // Mobile flows naturally
            }
        };

        window.addEventListener('resize', updateGalleryHeight);
        
        // Use ResizeObserver for accurate content width computation
        new ResizeObserver(updateGalleryHeight).observe(galleryStackedCards);

        // Initialize drop parameters 
        // We only want to set starting rotations on mobile/not scrolled states too just in case
        polaroids.forEach((card) => {
            card.style.transform = `rotate(${card.dataset.baserot}deg)`;
        });

        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 768) return; 
            
            const rect = gallerySection.getBoundingClientRect();
            const totalScrollableDistance = rect.height - window.innerHeight;
            let progress = -rect.top / totalScrollableDistance;
            progress = Math.max(0, Math.min(1, progress));

            const chunk = numCards > 0 ? 1 / numCards : 1; 

            if (galleryHeader) {
                // Header fades out smoothly only at the END of the scroll
                // meaning when progress goes from 0.8 to 1.0
                let headerOpacity = 1;
                if (progress > 0.8) {
                    const fadeProgress = (progress - 0.8) / 0.2; // 0 to 1
                    headerOpacity = 1 - fadeProgress;
                }
                galleryHeader.style.opacity = headerOpacity;
                galleryHeader.style.transform = `translateY(${(1 - headerOpacity) * -50}px)`;
            }
            
            // 1. Move the entire container (track) horizontally 
            // trackWidth is how much we have to scroll fully left so the last card reaches center padding essentially
            const trackWidth = galleryStackedCards.scrollWidth - window.innerWidth;
            const currentTranslateX = -trackWidth * progress;
            galleryStackedCards.style.transform = `translateX(${currentTranslateX}px)`;

            // 2. Individual card drop logic 
            polaroids.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + (cardRect.width / 2);
                const dropPoint = window.innerWidth * 0.35; // The card drops when its center passes 35% of the screen from the left

                if (cardCenter < dropPoint) {
                    const pastDrop = dropPoint - cardCenter;
                    // Max fall distance for our effect is 35% of screen width
                    const normalizedDrop = Math.min(1, pastDrop / (window.innerWidth * 0.35));
                    
                    const moveY = 150 * Math.pow(normalizedDrop, 2); // Downward acceleration
                    const baseRot = parseFloat(card.dataset.baserot) || 0;
                    const rot = baseRot - (25 * normalizedDrop); // Extra spin left
                    const opacity = 1 - (normalizedDrop * 1.5); // Fade fast
                    
                    card.style.transform = `translateY(${moveY}px) rotate(${rot}deg)`;
                    card.style.opacity = Math.max(0, opacity);
                } else {
                    const baseRot = parseFloat(card.dataset.baserot) || 0;
                    card.style.transform = `rotate(${baseRot}deg)`;
                    card.style.opacity = 1;
                }
            });
        });
        
        // Trigger once on load to set initial state
        window.dispatchEvent(new Event('scroll'));
    }

    // ========================================
    // Form Validation & Phone Mask
    // ========================================
    function initPhoneMask() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');

        phoneInputs.forEach(input => {
            // Force cursor to end on focus if empty or prefix only
            input.addEventListener('focus', () => {
                if (!input.value) {
                    input.value = '+7 (';
                }
            });

            // Prevent non-numeric input (except special keys)
            input.addEventListener('keydown', (e) => {
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                if (allowedKeys.includes(e.key)) return;

                // Allow numbers
                if (/^[0-9]$/.test(e.key)) return;

                // Block everything else
                e.preventDefault();
            });

            // Input mask logic
            input.addEventListener('input', (e) => {
                let value = input.value.replace(/\D/g, ''); // Remove all non-digits
                let formattedValue = '+7 (';

                // Handle backspace on prefix
                if (!value) {
                    input.value = '';
                    return;
                }

                // If user starts typing normally (without +7), handle it
                if (value.startsWith('7')) value = value.substring(1);
                if (value.startsWith('8')) value = value.substring(1);

                // Limit to 10 digits (excluding +7)
                value = value.substring(0, 10);

                if (value.length > 0) {
                    formattedValue += value.substring(0, 3);
                }
                if (value.length >= 4) {
                    formattedValue += ') ' + value.substring(3, 6);
                }
                if (value.length >= 7) {
                    formattedValue += '-' + value.substring(6, 8);
                }
                if (value.length >= 9) {
                    formattedValue += '-' + value.substring(8, 10);
                }

                input.value = formattedValue;
                input.classList.remove('input-error');
            });
        });
    }

    function initNameValidation() {
        const nameInputs = document.querySelectorAll('input[type="text"][placeholder*="имя" i], input[name="name"]');

        nameInputs.forEach(input => {
            input.setAttribute('maxlength', '30'); // Increased limit

            input.addEventListener('input', () => {
                const originalValue = input.value;
                // Allow only Cyrillic, Latin, spaces, hyphens
                let sanitizedValue = originalValue.replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, '');

                if (originalValue !== sanitizedValue) {
                    input.value = sanitizedValue;
                }

                input.classList.remove('input-error');
            });
        });
    }

    function initFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                let isValid = true;
                const phoneInput = form.querySelector('input[type="tel"]');
                const nameInput = form.querySelector('input[type="text"][placeholder*="имя" i]');

                // Validate Phone
                if (phoneInput) {
                    // Check strict length: +7 (XXX) XXX-XX-XX is 18 chars
                    if (phoneInput.value.length !== 18) {
                        e.preventDefault();
                        phoneInput.classList.add('input-error');
                        isValid = false;
                    }
                }

                // Validate Name
                if (nameInput) {
                    const nameVal = nameInput.value.trim();
                    if (nameVal.length < 2 || nameVal.length > 30) {
                        e.preventDefault();
                        nameInput.classList.add('input-error');
                        isValid = false;
                    }
                }

                if (!isValid) {
                    // Optional: Shake effect or message
                    e.preventDefault();
                } else {
                    // Allow submission (Simulation)
                    // e.preventDefault(); // Uncomment if real backend is not connected
                    // alert('Заявка отправлена!');
                }
            });
        });
    }

    initPhoneMask();
    initNameValidation();
    initFormValidation();

    // ========================================
    // Success Modal Logic
    // ========================================
    const successModal = document.getElementById('successModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const closeSuccessOverlay = document.getElementById('closeSuccessOverlay');
    const successModalCloseBtn = document.getElementById('successModalCloseBtn');

    function openSuccessModal() {
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSuccessModal() {
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccessModal);
    if (closeSuccessOverlay) closeSuccessOverlay.addEventListener('click', closeSuccessModal);
    if (successModalCloseBtn) successModalCloseBtn.addEventListener('click', closeSuccessModal);

    // Check for success parameter in URL (from PHP redirection)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'success') {
        setTimeout(openSuccessModal, 500); // Small delay for better UX
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // ========================================
    // Booking Wizard 2-Step Logic
    // ========================================
const bookingSection = document.getElementById('booking');
if (bookingSection) {
    let currentStep = 1;
    let selectedDate = new Date();
    selectedDate.setHours(0,0,0,0);
    let selectedTime = null;
    let orderItems = [];
    
    // UI Elements
    const panels = [
        document.getElementById('bookingStep1'),
        document.getElementById('bookingStep2')
    ];
    const indicators = document.querySelectorAll('.booking__step-indicator');
    
    // Step 1
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonthTitle = document.getElementById('calendarMonthTitle');
    const calendarPrev = document.getElementById('calendarPrev');
    const calendarNext = document.getElementById('calendarNext');
    const timeChips = document.querySelectorAll('.booking__time-chip');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const equipGrid = document.getElementById('equipGrid');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const btnToStep2 = document.getElementById('btnToStep2');
    
    // Step 2
    const btnBackToStep1 = document.getElementById('btnBackToStep1');
    const orderTableBody = document.getElementById('orderTableBody');
    const orderTotalPrice = document.getElementById('orderTotalPrice');
    const bookingForm = document.getElementById('bookingForm');
    const hiddenDate = document.getElementById('bookingDate');
    const hiddenTime = document.getElementById('bookingTime');
    const hiddenItems = document.getElementById('bookingItems');
    
    // ==================
    // 1. Navigation
    // ==================
    function goToStep(step) {
        panels.forEach((p, idx) => {
            if(p) p.classList.toggle('booking__panel--active', idx + 1 === step);
        });
        
        indicators.forEach((ind, idx) => {
            ind.classList.toggle('booking__step-indicator--active', idx + 1 === step);
        });
        
        currentStep = step;
        
        if (step === 2) {
            buildOrderTable();
            initCaptcha();
        }
    }

    function initCaptcha() {
        const qEl = document.getElementById('captchaQuestion');
        if (!qEl) return;
        const n1 = Math.floor(Math.random() * 9) + 1;
        const n2 = Math.floor(Math.random() * 9) + 1;
        qEl.textContent = `${n1} + ${n2}`;
        qEl.dataset.answer = n1 + n2;
    }
    
    if (btnToStep2) btnToStep2.addEventListener('click', () => {
        const errorBox = document.getElementById('bookingStep1Error') || (function(){
            const div = document.createElement('div');
            div.id = 'bookingStep1Error';
            div.style.color = '#F96943';
            div.style.backgroundColor = 'rgba(249, 105, 67, 0.1)';
            div.style.padding = '12px';
            div.style.borderRadius = '8px';
            div.style.marginBottom = '16px';
            div.style.fontSize = '14px';
            div.style.display = 'none';
            btnToStep2.parentElement.insertBefore(div, btnToStep2);
            return div;
        })();
        
        let errors = [];
        if (!selectedDate || !selectedTime) {
            errors.push('Не указана дата или время начала аренды.');
        }
        if (orderItems.length === 0) {
            errors.push('Не добавлена ни одна позиция оборудования.');
        }
        
        if (errors.length > 0) {
            errorBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + errors.join('<br>');
            errorBox.style.display = 'block';
            return;
        }
        
        errorBox.style.display = 'none';
        goToStep(2);
    });
    
    if (btnBackToStep1) btnBackToStep1.addEventListener('click', () => goToStep(1));
    
    // ==================
    // 2. Calendar Logic
    // ==================
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    let viewMonth = currentDate.getMonth();
    let viewYear = currentDate.getFullYear();
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    function renderCalendar() {
        if(!calendarGrid) return;
        
        // Clear old days (keep weekdays)
        const weekdaysHTML = `
            <span class="booking__calendar-weekday">Пн</span>
            <span class="booking__calendar-weekday">Вт</span>
            <span class="booking__calendar-weekday">Ср</span>
            <span class="booking__calendar-weekday">Чт</span>
            <span class="booking__calendar-weekday">Пт</span>
            <span class="booking__calendar-weekday">Сб</span>
            <span class="booking__calendar-weekday">Вс</span>
        `;
        calendarGrid.innerHTML = weekdaysHTML;
        
        calendarMonthTitle.textContent = `${monthNames[viewMonth]} ${viewYear}`;
        
        const firstDay = new Date(viewYear, viewMonth, 1);
        const lastDay = new Date(viewYear, viewMonth + 1, 0);
        let startGridDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        // Empty slots
        for(let i=0; i<startGridDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'booking__calendar-day booking__calendar-day--empty';
            calendarGrid.appendChild(empty);
        }
        
        for(let i=1; i<=lastDay.getDate(); i++) {
            const dayBtn = document.createElement('button');
            dayBtn.className = 'booking__calendar-day';
            dayBtn.textContent = i;
            dayBtn.type = 'button';
            
            const iterDate = new Date(viewYear, viewMonth, i);
            const realToday = new Date();
            realToday.setHours(0,0,0,0);

            if (iterDate.getTime() === realToday.getTime()) {
                dayBtn.classList.add('booking__calendar-day--today');
            }
            
            if(iterDate < realToday) {
                dayBtn.classList.add('booking__calendar-day--disabled');
            } else {
                if (selectedDate && iterDate.getTime() === selectedDate.getTime()) {
                    dayBtn.classList.add('booking__calendar-day--active');
                }
                
                dayBtn.addEventListener('click', () => {
                    selectedDate = new Date(viewYear, viewMonth, i);
                    if(selectedDateDisplay) {
                        const dd = String(selectedDate.getDate()).padStart(2, '0');
                        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        selectedDateDisplay.innerHTML = `Дата: <strong>${dd}.${mm}.${selectedDate.getFullYear()}</strong>`;
                    }
                    updateTimeChips();
                    renderCalendar();
                    validateStep1();
                });
            }
            
            calendarGrid.appendChild(dayBtn);
        }
    }
    
    if (calendarPrev) calendarPrev.addEventListener('click', () => {
        viewMonth--;
        if(viewMonth < 0) { viewMonth = 11; viewYear--; }
        renderCalendar();
    });
    
    if (calendarNext) calendarNext.addEventListener('click', () => {
        viewMonth++;
        if(viewMonth > 11) { viewMonth = 0; viewYear++; }
        renderCalendar();
    });

    function updateTimeChips() {
        if (!timeChips.length) return;
        const now = new Date();
        const realToday = new Date();
        realToday.setHours(0,0,0,0);
        const isToday = selectedDate && selectedDate.getTime() === realToday.getTime();
        
        let firstAvailableValue = null;

        timeChips.forEach(chip => {
            const chipTime = chip.dataset.time;
            const [h, m] = chipTime.split(':').map(Number);
            
            let isPast = false;
            if (isToday) {
                const slotDate = new Date();
                slotDate.setHours(h, m, 0, 0);
                if (slotDate < now) isPast = true;
            }

            if (isPast) {
                chip.classList.add('booking__time-chip--disabled');
                chip.style.opacity = '0.3';
                chip.style.pointerEvents = 'none';
                chip.classList.remove('booking__time-chip--active');
                if (selectedTime === chipTime) selectedTime = null;
            } else {
                chip.classList.remove('booking__time-chip--disabled');
                chip.style.opacity = '1';
                chip.style.pointerEvents = 'auto';
                if (!firstAvailableValue) firstAvailableValue = chipTime;
            }
        });

        // Auto-select nearest if current is null or invalid
        if (!selectedTime && firstAvailableValue) {
            selectedTime = firstAvailableValue;
            timeChips.forEach(c => {
                if(c.dataset.time === selectedTime) c.classList.add('booking__time-chip--active');
            });
        }
    }
    
    renderCalendar();
    updateTimeChips();

    // Initial display of selected date
    if(selectedDateDisplay) {
        const dd = String(selectedDate.getDate()).padStart(2, '0');
        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
        selectedDateDisplay.innerHTML = `Дата: <strong>${dd}.${mm}.${selectedDate.getFullYear()}</strong>`;
    }
    
    // ==================
    // 3. Time Selection
    // ==================
    timeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            timeChips.forEach(c => c.classList.remove('booking__time-chip--active'));
            chip.classList.add('booking__time-chip--active');
            selectedTime = chip.dataset.time;
            validateStep1();
        });
    });
    
    // ==================
    // 4. Equipment Logic
    // ==================
    function renderBookingEquipment() {
        const equipGrid = document.getElementById('equipGrid');
        if (!equipGrid) return;
        
        let html = '';
        for (const [id, data] of Object.entries(equipmentData)) {
            // Determine category
            let category = 'all';
            if (id.startsWith('sup_')) category = 'sup';
            else if (id.startsWith('kayak_') || id.startsWith('baidarka_')) category = 'kayak';
            else if (id.startsWith('photo_')) category = 'photo';
            
            // Determine price
            const priceVal = parseInt(data.price.replace(/\D/g, ''), 10);
            let priceHour = priceVal;
            let priceDay = priceVal;
            const isHourly = data.price.includes('час');
            
            if (isHourly) {
                // Approximate 1 day price = 3 hours if not explicitly provided
                priceDay = priceHour * 3;
            }
            
            html += `
                <div class="booking__equip-card js-open-equip-modal" data-category="${category}" data-equip-id="${id}" data-price-hour="${priceHour}" data-price-day="${priceDay}">
                    <div class="booking__equip-img">
                        <img src="${data.img}" alt="${data.title}" class="booking__equip-pic" onerror="this.src='assets/equip_sup_standard.png'">
                    </div>
                    <div class="booking__equip-body">
                        <h4 class="booking__equip-name">${data.title}</h4>
                        <p class="booking__equip-desc">${data.desc.length > 70 ? data.desc.substring(0, 70) + '...' : data.desc}</p>
                        <div class="booking__equip-prices">
                            <div class="booking__equip-price"><strong>${priceHour} ₽</strong><span>${isHourly ? 'в час' : 'разово'}</span></div>
                            ${isHourly ? `<div class="booking__equip-price"><strong>${priceDay} ₽</strong><span>в день</span></div>` : ''}
                        </div>
                        <div class="booking__equip-controls">
                            <div class="booking__qty-wrap">
                                <button class="booking__qty-btn" data-action="minus" type="button">−</button>
                                <span class="booking__qty-value">0</span>
                                <button class="booking__qty-btn" data-action="plus" type="button">+</button>
                            </div>
                            ${isHourly ? `
                            <select class="booking__duration-select">
                                <option value="1">1 час</option>
                                <option value="2">2 часа</option>
                                <option value="3">3 часа</option>
                                <option value="day">Весь день</option>
                                <option value="custom">Другое...</option>
                            </select>
                            ` : `
                            <select class="booking__duration-select" style="display: none;">
                                <option value="1" selected>1 раз</option>
                            </select>
                            `}
                        </div>
                        <div class="booking__custom-duration" style="display: none;">
                            <label>Период аренды:</label>
                            <input type="text" class="booking__custom-date" placeholder="Выберите даты..." readonly required>
                        </div>
                        <div class="booking__equip-subtotal">Итого: <strong>0 ₽</strong></div>
                    </div>
                </div>
            `;
        }
        
        equipGrid.innerHTML = html;
        bindBookingEvents();
    }

    function extractNumber(str) { return parseInt(str.replace(/\D/g, ''), 10); }

    function updateCartTotal() {
        let total = 0;
        orderItems = [];
        
        const cards = document.querySelectorAll('.booking__equip-card');
        cards.forEach(card => {
            const qty = parseInt(card.querySelector('.booking__qty-value').textContent, 10);
            if (qty > 0) {
                card.classList.add('booking__equip-card--active');
                const subtotalText = card.querySelector('.booking__equip-subtotal strong').textContent;
                const subT = extractNumber(subtotalText);
                total += subT;
                
                const name = card.querySelector('.booking__equip-name').textContent;
                const durationSelect = card.querySelector('.booking__duration-select');
                const pHour = parseInt(card.dataset.priceHour, 10);
                const pDay = parseInt(card.dataset.priceDay, 10);
                let durText = durationSelect.options[durationSelect.selectedIndex].text;
                
                orderItems.push({
                    id: card.dataset.equipId,
                    name: name,
                    qty: qty,
                    duration: durText,
                    priceHour: pHour,
                    priceDay: pDay,
                    subtotal: subT
                });
            } else {
                card.classList.remove('booking__equip-card--active');
            }
        });
        
        if (total > 0) {
            if (cartSummary) {
                cartSummary.style.display = 'block';
                const cartItemsList = document.getElementById('cartItemsList');
                if (cartItemsList) {
                    let itemsHtml = '';
                    orderItems.forEach(item => {
                        let plural = 'шт.';
                        itemsHtml += `
                            <div class="booking__cart-item" style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 12px; border-radius: 8px; border: 1px solid rgba(16, 46, 72, 0.1);">
                                <div class="booking__cart-item-info" style="display: flex; flex-direction: column; gap: 4px;">
                                    <strong style="color: #102E48; font-size: 14px;">${item.name}</strong>
                                    <span style="color: #4A5568; font-size: 12px;">${item.qty} ${plural} &times; ${item.duration}</span>
                                </div>
                                <div class="booking__cart-item-actions" style="display: flex; align-items: center; gap: 12px;">
                                    <span style="font-weight: 700; color: #102E48; font-size: 14px;">${item.subtotal.toLocaleString('ru-RU')} ₽</span>
                                    <button type="button" class="booking__cart-item-del" data-id="${item.id}" style="background: none; border: none; color: #ff4d4f; cursor: pointer; padding: 4px; transition: 0.2s;" onmouseover="this.style.color='#d9363e'" onmouseout="this.style.color='#ff4d4f'">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                    cartItemsList.innerHTML = itemsHtml;
                    
                    cartItemsList.querySelectorAll('.booking__cart-item-del').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const equipId = e.currentTarget.dataset.id;
                            const card = document.querySelector(`.booking__equip-card[data-equip-id="${equipId}"]`);
                            if (card) {
                                card.querySelector('.booking__qty-value').textContent = '0';
                                // Call updateCardSubtotal to recalculate total and delete from cart
                                // We have to call global functions or dispatch events.
                                // It's better to trigger click on minus button down to 0, or just call updateCardSubtotal if it's in scope.
                                // Yes, updateCardSubtotal is in the same scope since this is all inside bind events.
                                
                                // To make sure updateCardSubtotal runs
                                try {
                                    updateCardSubtotal(card);
                                } catch(err) {
                                    // if out of scope, dispatch click on minus until 0
                                    let minusBtn = card.querySelector('[data-action="minus"]');
                                    let qtyVal = parseInt(card.querySelector('.booking__qty-value').textContent, 10);
                                    while(qtyVal > 0) {
                                        minusBtn.click();
                                        qtyVal = parseInt(card.querySelector('.booking__qty-value').textContent, 10);
                                    }
                                }
                            }
                        });
                    });
                }
            }
            if (cartTotalPrice) cartTotalPrice.textContent = total.toLocaleString('ru-RU') + ' ₽';
        } else {
            if (cartSummary) cartSummary.style.display = 'none';
        }
        
        const btnClearCart = document.getElementById('btnClearCart');
        if (btnClearCart) btnClearCart.style.display = total > 0 ? 'inline-flex' : 'none';
        
        validateStep1();
    }
    
    function validateStep1() {
        const errorBox = document.getElementById('bookingStep1Error');
        if (errorBox && selectedDate && selectedTime && orderItems.length > 0) {
            errorBox.style.display = 'none';
        }
    }
    
    function updateCardSubtotal(card) {
        const qty = parseInt(card.querySelector('.booking__qty-value').textContent, 10);
        const durationSelect = card.querySelector('.booking__duration-select');
        const durVal = durationSelect.value;
        const pHour = parseInt(card.dataset.priceHour, 10);
        const pDay = parseInt(card.dataset.priceDay, 10);
        const subtotalEl = card.querySelector('.booking__equip-subtotal strong');
        
        let subtotal = 0;
        if (durVal === 'day') subtotal = qty * pDay;
        else if (durVal === 'custom') subtotal = qty * pDay; // simplify custom
        else subtotal = qty * pHour * parseInt(durVal, 10);
        
        subtotalEl.textContent = subtotal.toLocaleString('ru-RU') + ' ₽';
        updateCartTotal();
    }
    
    function bindBookingEvents() {
        // Bind Qty Buttons
        document.querySelectorAll('.booking__qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent modal from opening when clicking qty buttons
                const card = e.target.closest('.booking__equip-card');
                const qtySpan = card.querySelector('.booking__qty-value');
                let val = parseInt(qtySpan.textContent, 10);
                if (e.target.dataset.action === 'plus') val++;
                else if (e.target.dataset.action === 'minus') val--;
                
                if (val < 0) val = 0;
                if (val > 10) val = 10;
                qtySpan.textContent = val;
                
                updateCardSubtotal(card);
            });
        });
        
        // Bind Duration Selects
        document.querySelectorAll('.booking__duration-select').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const card = e.target.closest('.booking__equip-card');
                const customDate = card.querySelector('.booking__custom-duration');
                if (sel.value === 'custom' && customDate) {
                    customDate.style.display = 'block';
                } else if (customDate) {
                    customDate.style.display = 'none';
                }
                updateCardSubtotal(card);
            });
            
            // Prevent modal from opening when clicking select
            sel.addEventListener('click', (e) => e.stopPropagation());
        });
        
        // Update Modal interactions for newly generated cards
        document.querySelectorAll('.js-open-equip-modal').forEach(card => {
            card.addEventListener('click', (e) => {
                // If clicking on controls, ignore modal open
                if (e.target.closest('.booking__equip-controls') || e.target.closest('.booking__custom-duration')) return;
                
                const equipId = card.dataset.equipId;
                const data = equipmentData[equipId];
                if (!data) return;

                const equipModal = document.getElementById('equipDetailModal');
                if(!equipModal) return;

                equipModal.querySelector('.modal__pic').src = data.img;
                equipModal.querySelector('.modal__pic').alt = data.title;
                equipModal.querySelector('.modal__title').textContent = data.title;
                equipModal.querySelector('.modal__desc').textContent = data.desc;
                
                // Display price in modal and change btn text
                const priceEl = equipModal.querySelector('.modal__price strong');
                if(priceEl) {
                    priceEl.textContent = data.price;
                }
                const btnAction = equipModal.querySelector('.modal__action-btn');
                if(btnAction) {
                    btnAction.textContent = 'Забронировать';
                }

                const specsContainer = equipModal.querySelector('.modal__specs');
                specsContainer.innerHTML = '';
                data.specs.forEach(spec => {
                    specsContainer.innerHTML += `<li><strong>${spec.label}</strong><span>${spec.value}</span></li>`;
                });

                equipModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Clear Cart
    const btnClearCart = document.getElementById('btnClearCart');
    if (btnClearCart) {
        btnClearCart.addEventListener('click', () => {
            document.querySelectorAll('.booking__qty-value').forEach(q => q.textContent = '0');
            document.querySelectorAll('.booking__equip-card').forEach(c => updateCardSubtotal(c));
        });
    }

    // ========================================
    // Equipment Cart Controls (Search, Categories)
    // ========================================
    const equipSearch = document.getElementById('equipSearch');
    const equipCategories = document.getElementById('equipCategories');
    let currentCategory = 'all';
    let currentSearch = '';

    function filterEquipment() {
        if (!equipGrid) return;
        const cards = equipGrid.querySelectorAll('.booking__equip-card');
        
        cards.forEach(card => {
            const name = card.querySelector('.booking__equip-name').textContent.toLowerCase();
            const desc = card.querySelector('.booking__equip-desc').textContent.toLowerCase();
            const category = card.dataset.category || 'all';
            
            const matchSearch = name.includes(currentSearch) || desc.includes(currentSearch);
            const matchCategory = currentCategory === 'all' || category === currentCategory;
            
            if (matchSearch && matchCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (equipSearch) {
        equipSearch.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            filterEquipment();
        });
    }

    if (equipCategories) {
        equipCategories.addEventListener('click', (e) => {
            if (e.target.classList.contains('booking__cat-btn')) {
                equipCategories.querySelectorAll('.booking__cat-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentCategory = e.target.dataset.filter;
                filterEquipment();
            }
        });
    }
    
    // ==================
    // 5. Checkout Table
    // ==================
    renderBookingEquipment();
    // ==================
    function buildOrderTable() {
        if(!orderTableBody) return;
        orderTableBody.innerHTML = '';
        let grandTotal = 0;
        
        orderItems.forEach(item => {
            grandTotal += item.subtotal;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.qty} шт</td>
                <td>${item.duration}</td>
                <td style="font-weight:700;">${item.subtotal.toLocaleString('ru-RU')} ₽</td>
            `;
            orderTableBody.appendChild(tr);
        });
        
        if (orderTotalPrice) {
            orderTotalPrice.textContent = grandTotal.toLocaleString('ru-RU') + ' ₽';
        }
    }
    
    // Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Captcha validation
            const answerInput = document.getElementById('captchaAnswer');
            const qEl = document.getElementById('captchaQuestion');
            if (answerInput && qEl) {
                if (parseInt(answerInput.value, 10) !== parseInt(qEl.dataset.answer, 10)) {
                    alert('Неправильный ответ капчи. Пожалуйста, попробуйте еще раз.');
                    initCaptcha();
                    answerInput.value = '';
                    return;
                }
            }
            
            // Generate exact date format DD.MM.YYYY
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const yyyy = selectedDate.getFullYear();
            
            hiddenDate.value = `${dd}.${mm}.${yyyy}`;
            hiddenTime.value = selectedTime;
            hiddenItems.value = JSON.stringify(orderItems);
            
            bookingForm.submit();
        });
    }
}

}); // End of DOMContentLoaded

// ========================================
// GALLERY — Polaroid Fanning Scroll Animation
// ========================================
(function initGalleryFanning() {
    const section = document.querySelector('.gallery');
    if (!section) return;
    
    const stickyWrap = section.querySelector('.gallery__sticky-wrap');
    const header = section.querySelector('.gallery__header');
    const cards = Array.from(section.querySelectorAll('.gallery__polaroid'));
    const stack = section.querySelector('.gallery__polaroids-stack');
    const swipeHint = document.getElementById('gallerySwipeHint');
    const totalCards = cards.length;
    
    if (totalCards === 0) return;
    
    // Skip on mobile — CSS handles the fallback
    if (window.innerWidth <= 768) {
        if (swipeHint) {
            swipeHint.classList.add('visible');
            const hideHint = () => {
                swipeHint.style.opacity = '0';
                setTimeout(() => swipeHint.remove(), 400);
                stack.removeEventListener('scroll', hideHint);
                stack.removeEventListener('touchstart', hideHint);
            };
            stack.addEventListener('scroll', hideHint, { passive: true });
            stack.addEventListener('touchstart', hideHint, { passive: true });
        }
        return;
    }
    
    // Initial z-index: first card on top
    cards.forEach((card, i) => {
        card.style.zIndex = totalCards - i;
        // All cards start stacked in center, slightly scaled down except the first
        if (i > 0) {
            card.style.transform = 'scale(0.92)';
            card.style.opacity = '1';
        } else {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
        }
    });
    
    // Each card gets an equal portion of the fanning scroll range (which is 85% of total scroll)
    const fanCards = totalCards - 1; 
    let ticking = false;
    
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateCards);
    }
    
    function updateCards() {
        ticking = false;
        
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        const scrolled = -rect.top;
        const totalScrollable = sectionHeight - viewportHeight;
        
        if (totalScrollable <= 0) return;
        
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
        
        // Phase 1: Entry (0 to 0.15)
        // Header fades out and moves up
        // Stack moves from Y: 20vh to Y: 0 (center)
        const entryEnd = 0.15;
        let entryProgress = Math.min(1, progress / entryEnd);
        
        if (header) {
            header.style.opacity = 1 - entryProgress;
            header.style.transform = `translateY(${-50 * entryProgress}px)`;
        }
        
        if (stack) {
            // Start 20vh below center, move to 0
            const startY = 20; 
            stack.style.transform = `translateY(${startY - (startY * entryProgress)}vh)`;
        }
        
        // Phase 2: Fanning (0.15 to 1.0)
        let fanProgress = 0;
        if (progress > entryEnd) {
            fanProgress = (progress - entryEnd) / (1 - entryEnd);
        }
        
        // Calculate per-card fan progress
        cards.forEach((card, i) => {
            if (i >= fanCards) {
                // Last card — stays centered, scales up from 0.92 to 1.0
                const lastCardStart = (fanCards - 1) / fanCards;
                const lastProgress = Math.max(0, Math.min(1, (fanProgress - lastCardStart) / (1 - lastCardStart)));
                const scale = 0.92 + 0.08 * lastProgress;
                card.style.transform = `scale(${scale})`;
                card.style.opacity = '1';
                return;
            }
            
            // Each card fans during its segment
            const segmentSize = 1 / fanCards;
            const cardStart = i * segmentSize;
            const cardEnd = (i + 1) * segmentSize;
            
            const cardProgress = Math.max(0, Math.min(1, (fanProgress - cardStart) / (cardEnd - cardStart)));
            
            if (cardProgress <= 0) {
                // Not yet fanning
                const scale = i === 0 ? 1 : 0.92;
                card.style.transform = `scale(${scale})`;
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            } else if (cardProgress >= 1) {
                // Fully fanned away horizontally
                card.style.transform = 'translateX(-150vw) scale(0.9)';
                card.style.opacity = '0';
                card.style.pointerEvents = 'none';
            } else {
                // Fanning in progress — horizontal slide smooth easing
                const eased = cardProgress * cardProgress * (3 - 2 * cardProgress); // smoothstep
                
                const translateX = -150 * eased; // Pure horizontal slide to the left
                const opacity = 1 - (eased * 1.5); // Fade out slightly as it leaves
                const scale = 1 - 0.1 * eased;
                
                card.style.transform = `translateX(${translateX}vw) scale(${scale})`;
                card.style.opacity = opacity > 0 ? opacity : 0;
                card.style.pointerEvents = cardProgress > 0.5 ? 'none' : 'auto';
            }
            
            // Next card (the one being revealed) scales up
            if (i < fanCards - 1) {
                const nextCard = cards[i + 1];
                if (cardProgress > 0 && cardProgress <= 1) {
                    const revealScale = 0.92 + 0.08 * cardProgress;
                    const nextSegStart = (i + 1) * segmentSize;
                    const nextProgress = (fanProgress - nextSegStart) / (cardEnd - cardStart);
                    if (nextProgress <= 0) {
                        nextCard.style.transform = `scale(${revealScale})`;
                    }
                }
            }
        });
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial state
    updateCards();
})();
