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
        'sup_magma': {
            title: 'Aqua Marina Magma',
            img: 'assets/SUP/Сап аренда сапборды/Aqua Marina SUP Magma сап для крупных гребцов до 120 кг. .jpg',
            desc: 'Надежный премиальный сапборд от Aqua Marina. Отличная грузоподъемность для райдеров до 120 кг (на фото оранжево-серо-белая палуба).',
            price: '500 ₽/час',
            specs: [
                { label: 'Модель', value: 'Magma' },
                { label: 'Бренд', value: 'Aqua Marina' },
                { label: 'Грузоподъемность', value: 'до 120 кг' }
            ]
        },
        'sup_rental': {
            title: 'Aqua Marina Rental',
            img: 'assets/SUP/Сап аренда сапборды/Aqua Marina SUP rental сап для крупных гребцов до 100 кг. .jpg',
            desc: 'Классическая универсальная доска Aqua Marina для проката в красно-белых тонах. Прочная и стабильная на воде.',
            price: '500 ₽/час',
            specs: [
                { label: 'Серия', value: 'Прокатная' },
                { label: 'Бренд', value: 'Aqua Marina' },
                { label: 'Грузоподъемность', value: 'до 100 кг' }
            ]
        },
        'sup_zray': {
            title: 'Zray Pure Air 10\'2"',
            img: 'assets/SUP/Сап аренда сапборды/Aqua Marina SUP-доска79 см.jpg',
            desc: 'Маневренный и легкий сапборд Zray Pure Air шириной 79 см. Отличный баланс скорости и управляемости.',
            price: '500 ₽/час',
            specs: [
                { label: 'Размер', value: '10\'2" (310 см)' },
                { label: 'Ширина', value: '79 см' },
                { label: 'Бренд', value: 'Zray' }
            ]
        },
        'sup_kahawai': {
            title: 'Aqua Marina KAHawai 10\'2"',
            img: 'assets/SUP/Сап аренда сапборды/XXL (3).jpg',
            desc: 'Специализированная туринговая доска KAHawai со стильным зелено-белым дизайном. Идеальна для ровной воды и легкого течения.',
            price: '500 ₽/час',
            specs: [
                { label: 'Модель', value: 'KAHawai' },
                { label: 'Размер', value: '10\'2"' },
                { label: 'Бренд', value: 'Aqua Marina' }
            ]
        },
        'sup_vibrant': {
            title: 'Aqua Marina Vibrant (Детский)',
            img: 'assets/SUP/Сап аренда сапборды/XXL (4).jpg',
            desc: 'Специальная детская доска для самых юных райдеров в ярком желтом цвете. Легкий старт и безопасное обучение.',
            price: '500 ₽/час',
            specs: [
                { label: 'Модель', value: 'Vibrant' },
                { label: 'Тип', value: 'Детский / Подростковый' },
                { label: 'Бренд', value: 'Aqua Marina' }
            ]
        },
        'sup_dhyana': {
            title: 'Aqua Marina Dhyana (Йога)',
            img: 'assets/SUP/Сап аренда сапборды/XXL (5).jpg',
            desc: 'Самая крупная и устойчивая доска, созданная специально для йоги и фитнеса на воде. За счет габаритов на ней комфортно могут кататься 2-3 человека.',
            price: '500 ₽/час',
            specs: [
                { label: 'Модель', value: 'Dhyana' },
                { label: 'Вместимость', value: '2-3 человека' },
                { label: 'Бренд', value: 'Aqua Marina' }
            ]
        },
        'sup_huakai': {
            title: 'Hydro-Force Huakai 10\'0"',
            img: 'assets/SUP/Сап аренда сапборды/XXL (6).jpg',
            desc: 'Широкая доска Hydro-Force Huakai (оранжево-синяя), обладающая высокой остойчивостью. Подходит для различных стилей катания.',
            price: '500 ₽/час',
            specs: [
                { label: 'Модель', value: 'Huakai' },
                { label: 'Размер', value: '10\'0"' },
                { label: 'Бренд', value: 'Hydro-Force' }
            ]
        },
        'sup_js': {
            title: 'JS Board',
            img: 'assets/SUP/Сап аренда сапборды/XXL (7).jpg',
            desc: 'Классическая доска JS с белой палубой и синими бортами, надежной двухслойной конструкцией.',
            price: '500 ₽/час',
            specs: [
                { label: 'Тип', value: 'Универсальный' },
                { label: 'Цвет', value: 'Бело-синий' },
                { label: 'Бренд', value: 'JS Board' }
            ]
        },
        'sup_beast_2': {
            title: 'Aqua Marina Beast (Синяя)',
            img: 'assets/SUP/Сап аренда сапборды/XXL (8).jpg',
            desc: 'Популярная доска Aqua Marina Beast в ярко-синем дизайне ультимативной серии All-Around.',
            price: '500 ₽/час',
            specs: [
                { label: 'Модель', value: 'Beast' },
                { label: 'Серия', value: 'Универсальная' },
                { label: 'Бренд', value: 'Aqua Marina' }
            ]
        },
        'sup_freesoul': {
            title: 'Hydro-Force Freesoul 11\'2"',
            img: 'assets/SUP/Сап аренда сапборды/XXL (9).jpg',
            desc: 'Крупногабаритная зеленая доска Hydro-Force Freesoul Tech. Оптимальна для долгих туринговых сплавов.',
            price: '500 ₽/час',
            specs: [
                { label: 'Модель', value: 'Freesoul Tech' },
                { label: 'Размер', value: '11\'2"' },
                { label: 'Бренд', value: 'Hydro-Force' }
            ]
        },
        'sup_journey': {
            title: 'Journey SUP',
            img: 'assets/SUP/Сап аренда сапборды/XXL (10).jpg',
            desc: 'Стильная доска Journey в сине-серых тонах для комфортных путешествий. Уверенно держит курс.',
            price: '500 ₽/час',
            specs: [
                { label: 'Тип', value: 'Прогулочный' },
                { label: 'Цвет', value: 'Сине-серо-белый' },
                { label: 'Бренд', value: 'Journey' }
            ]
        },
        'sup_gs_sport': {
            title: 'GS Sport 11\'0"',
            img: 'assets/SUP/Сап аренда сапборды/XXL (11).jpg',
            desc: 'Спортивный туринговый сапборд GS Sport с темно-синим паттерном. Создан для развития скорости на длинных дистанциях.',
            price: '500 ₽/час',
            specs: [
                { label: 'Тип', value: 'Спортивный (Touring)' },
                { label: 'Размер', value: '11\'0"' },
                { label: 'Бренд', value: 'GS Sport' }
            ]
        },
        'sup_mirtlsol': {
            title: 'Mirtlsol SUP',
            img: 'assets/SUP/Сап аренда сапборды/XXL (12).jpg',
            desc: 'Компактный и послушный сап Mirtlsol, отличный вариант для размеренных водных прогулок.',
            price: '500 ₽/час',
            specs: [
                { label: 'Тип', value: 'All-round' },
                { label: 'Окрас', value: 'Стрелочный паттерн' },
                { label: 'Бренд', value: 'Mirtlsol' }
            ]
        },
        // ========== БАЙДАРКИ ==========
        'baidarka_3': {
            title: 'Байдарка 3-местная',
            img: 'assets/equip/baidarka3_1.jpg',
            desc: 'Вместительная трехместная байдарка. В стоимость входит аренда байдарки, весла и спасжилета. В наличии 10 штук.',
            price: '900 ₽/час',
            specs: [
                { label: 'Вместимость', value: '3 человека' },
                { label: 'В наличии', value: '10 шт' },
                { label: 'Включено', value: 'Весла + жилеты' },
                { label: 'Тип', value: 'Байдарка' }
            ]
        },
        // ========== КАЯКИ ==========
        'kayak_1': {
            title: 'Пластиковый каяк 1-местный',
            img: 'assets/equip/kayak1_new.jpg',
            desc: 'Одноместный каяк для самостоятельных исследований реки. Удобная посадка и отличная курсовая устойчивость.',
            price: '500 ₽/час',
            specs: [
                { label: 'Вместимость', value: '1 человек' },
                { label: 'В наличии', value: '17 шт' },
                { label: 'Включено', value: 'Весло + жилет' },
                { label: 'Материал', value: 'Пластик' }
            ]
        },
        'kayak_2': {
            title: 'Пластиковый каяк 2-местный',
            img: 'assets/equip/kayak2_new.jpg',
            desc: 'Двухместный каяк для парного катания. Хорошо держит волну и обеспечивает комфортное перемещение вдвоем.',
            price: '700 ₽/час',
            specs: [
                { label: 'Вместимость', value: '2 человека' },
                { label: 'В наличии', value: '11 шт' },
                { label: 'Включено', value: 'Весла + жилеты' },
                { label: 'Материал', value: 'Пластик' }
            ]
        },
        'kayak_3': {
            title: 'Пластиковый каяк 3-местный',
            img: 'assets/equip/kayak3_1.jpg',
            desc: 'Трёхместный семейный каяк (Sit-on-top). Идеально для двух взрослых и ребенка.',
            price: '900 ₽/час',
            specs: [
                { label: 'Вместимость', value: '2 взр. + 1 реб.' },
                { label: 'В наличии', value: '4 шт' },
                { label: 'Включено', value: 'Весла + жилеты' },
                { label: 'Материал', value: 'Пластик' }
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
    const galleryStackedCards = document.getElementById('galleryStackedCards');
    
    if (gallerySection && galleryStackedCards) {
        const polaroids = galleryStackedCards.querySelectorAll('.polaroid-gallery__card');
        let trackWidth = 0;
        let targetX = 0;
        let currentX = 0;
        let isLerping = false;

        // Dynamically adjust gallery container height
        const updateGalleryHeight = () => {
            if (window.innerWidth > 768) {
                // Determine horizontal distance
                const lastCard = polaroids[polaroids.length - 1];
                if (lastCard) {
                    // Center the last card in the middle of the window at the end of the scroll
                    const lastCardCenterOffset = lastCard.offsetLeft + (lastCard.offsetWidth / 2);
                    trackWidth = lastCardCenterOffset - (window.innerWidth / 2);
                    if (trackWidth < 0) trackWidth = 0;
                } else {
                    trackWidth = galleryStackedCards.scrollWidth - window.innerWidth + 40;
                }
                
                // 400vh provides a long, slow scroll duration so clients can see all slides
                gallerySection.style.height = `calc(400vh + ${trackWidth}px)`;
            } else {
                gallerySection.style.height = 'auto'; // Mobile flows naturally
            }
        };

        window.addEventListener('resize', updateGalleryHeight);
        new ResizeObserver(updateGalleryHeight).observe(galleryStackedCards);

        // Smooth Lerp loop
        const lerp = (start, end, factor) => start + (end - start) * factor;
        
        const tick = () => {
            // Apply smoothing
            currentX = lerp(currentX, targetX, 0.08); // 0.08 is the smoothing factor
            
            // Round to 1 decimal to avoid infinite micro-calculations
            if (Math.abs(targetX - currentX) < 0.1) {
                currentX = targetX;
            }
            
            galleryStackedCards.style.transform = `translate3d(${currentX}px, 0, 0)`;
            
            if (currentX !== targetX) {
                requestAnimationFrame(tick);
            } else {
                isLerping = false;
            }
        };

        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 768) return; 
            
            const rect = gallerySection.getBoundingClientRect();
            const totalScrollableDistance = rect.height - window.innerHeight;
            
            let progress = -rect.top / totalScrollableDistance;
            progress = Math.max(0, Math.min(1, progress));

            // Target position based on scroll progress
            targetX = -trackWidth * progress;
            
            // Start the animation loop if it's not already running
            if (!isLerping && currentX !== targetX) {
                isLerping = true;
                requestAnimationFrame(tick);
            }
        });
        
        // Trigger once on load
        window.dispatchEvent(new Event('scroll'));
    }

    // ========================================
    // Cookie Banner Logic
    // ========================================
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAcceptAllBtn = document.getElementById('cookieAcceptAllBtn');
    const cookieSettingsBtn = document.getElementById('cookieSettingsBtn');
    const cookieSettingsBlock = document.getElementById('cookieSettingsBlock');
    const cookieSaveBtn = document.getElementById('cookieSaveBtn');

    if (cookieBanner) {
        // Check if user already consented
        const cookieConsent = localStorage.getItem('cookieConsent');
        
        if (!cookieConsent) {
            // Show banner after short delay
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        if (cookieAcceptAllBtn) {
            cookieAcceptAllBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'all');
                cookieBanner.classList.remove('show');
            });
        }

        if (cookieSettingsBtn) {
            cookieSettingsBtn.addEventListener('click', () => {
                cookieSettingsBlock.classList.toggle('open');
                if (cookieSettingsBlock.classList.contains('open')) {
                    cookieSettingsBtn.style.display = 'none';
                    if (cookieSaveBtn) cookieSaveBtn.style.display = 'block';
                }
            });
        }

        if (cookieSaveBtn) {
            cookieSaveBtn.addEventListener('click', () => {
                // Determine what was checked
                const analytics = document.getElementById('cookieAnalytics')?.checked;
                const marketing = document.getElementById('cookieMarketing')?.checked;
                const consentData = {
                    analytics: analytics,
                    marketing: marketing,
                    necessary: true
                };
                localStorage.setItem('cookieConsent', JSON.stringify(consentData));
                cookieBanner.classList.remove('show');
            });
        }
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
                        <img src="${data.img}" alt="${data.title}" class="booking__equip-pic" onerror="this.src='assets/equip/sup_1.jpg'">
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
    
    // Bot Protection
    function initCaptcha() {
        const qEl = document.getElementById('captchaQuestion');
        if (!qEl) return;
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        qEl.textContent = `Сколько будет ${num1} + ${num2}?`;
        qEl.dataset.answer = num1 + num2;
    }
    
    // Initialize captcha when page loads
    initCaptcha();

    // Form Submission
    const mainBookingForm = document.getElementById('bookingForm');
    if (mainBookingForm) {
        mainBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Honeypot validation
            const honeypot = mainBookingForm.querySelector('.honeypot-field');
            if (honeypot && honeypot.value) {
                // If bot filled it out, silently fail without submitting
                console.log('Bot detected');
                alert('Заявка успешно отправлена!');
                return;
            }

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
            
            mainBookingForm.submit();
        });
    }
}


    // ========================================
    // Dynamic Rendering JS (Equipment & Tours)
    // ========================================

    function renderEquipmentElements(filter = 'all') {
        const grid = document.getElementById('equipmentGrid');
        if (!grid) return;
        
        let html = '';
        let count = 0;
        
        // Filter logic
        const filteredEntries = Object.entries(equipmentData).filter(([id, data]) => {
            if (filter === 'all') return true;
            if (filter === 'sup' && id.startsWith('sup_')) return true;
            if (filter === 'kids' && id === 'sup_vibrant') return true;
            if (filter === 'yoga' && id === 'sup_dhyana') return true;
            if (filter === 'kayak' && (id.startsWith('kayak_') || id.startsWith('baidarka_'))) return true;
            return false;
        });

        for (const [id, data] of filteredEntries) {
            // Hide items beyond 8 only when viewing ALL
            const isHidden = (filter === 'all' && count >= 8) ? 'equipment__card_hidden' : '';
            
            // Build specs
            let specsHtml = '';
            if (data.specs) {
                specsHtml = data.specs.map(s => `<span class="equipment__spec"><strong>${s.label}:</strong> ${s.value}</span>`).join('');
            }
            
            const badgeHtml = data.badge ? `<span class="equipment__badge">${data.badge}</span>` : '';
            const imgSrc = data.images && data.images.length > 0 ? data.images[0] : (data.img || 'assets/equip/sup_1.jpg');
            
            html += `
                <div class="equipment__card ${isHidden} js-open-equip-modal" data-equip-id="${id}">
                    ${badgeHtml}
                    <div class="equipment__image-wrapper">
                        <img src="${imgSrc}" alt="${data.title}" class="equipment__image" loading="lazy">
                    </div>
                    <div style="display:flex; flex-direction:column; flex-grow:1; padding:24px;">
                        <h3 class="equipment__card-title" style="margin-bottom:8px;">${data.title}</h3>
                        <p class="equipment__card-desc" style="flex-grow:1; margin-bottom:16px;">${data.desc}</p>
                        <div class="equipment__specs" style="margin-bottom:16px;">${specsHtml}</div>
                        <div class="equipment__price" style="font-weight:700; color:var(--brand-orange); margin-bottom:16px; font-size:1.25rem;">${data.price}</div>
                        <button class="equipment__btn hero__button_primary hero__button" style="width:100%;" onclick="event.stopPropagation(); window.openEquipModal('${id}')">Подробнее / Забронировать</button>
                    </div>
                </div>`;
            count++;
        }
        grid.innerHTML = html;
        
        // Update show more button visibility
        const showMoreBtn = document.getElementById('showMoreEquipment');
        if (showMoreBtn) {
            if (filter === 'all' && Object.keys(equipmentData).length > 8) {
                showMoreBtn.style.display = 'flex';
                showMoreBtn.classList.remove('active');
            } else {
                showMoreBtn.style.display = 'none';
            }
        }
    }


    const scenariosData = {
        'solo': {
            title: 'Одиночные прогулки',
            desc: 'Насладитесь тишиной воды наедине с природой. Отдых от суеты.',
            img: 'assets/SUP/Соло катание.jpg'
        },
        'date': {
            title: 'Романтическое свидание',
            desc: 'Прогулка для двоих на закате. Незабываемая атмосфера.',
            img: 'assets/SUP/IMG_8529.jpg'
        },
        'family': {
            title: 'Семейный отдых',
            desc: 'Безопасные каяки и сапы для веселого времени с детьми.',
            img: 'assets/SUP/Дети на САП.jpg'
        },
        'photo': {
            title: 'Фотосессия на воде',
            desc: 'Профессиональные снимки на воде и берегу.',
            img: 'assets/SUP/IMG_7757.jpg'
        },
        'sunset': {
            title: 'Сплав на закате',
            desc: 'Вечерний тур по реке в лучах заката. Самые красивые виды.',
            img: 'assets/Релакс На закате на сап.jpg'
        },
        'corporate': {
            title: 'Корпоратив на воде',
            desc: 'Тимбилдинг и командный отдых для коллег. Весело и полезно.',
            img: 'assets/Корпоративный отдых/_R004981.jpg'
        }
    };

    function renderScenariosElements() {
        const grid = document.getElementById('scenariosGrid');
        if (!grid) return;
        
        let html = '';
        for (const [id, data] of Object.entries(scenariosData)) {
            html += `
                <div class="scenarios__card" style="display:flex; flex-direction:column; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); transition:transform 0.3s ease;">
                    <img src="${data.img}" alt="${data.title}" style="height:220px; object-fit:cover; width:100%;">
                    <div style="padding:24px; flex-grow:1; display:flex; flex-direction:column;">
                        <h3 style="margin-bottom:12px; font-size:1.25rem; font-weight:800; color:var(--brand-blue);">${data.title}</h3>
                        <p style="color:#666; font-size:0.95rem; line-height:1.5;">${data.desc}</p>
                    </div>
                </div>`;
        }
        grid.innerHTML = html;
        
        const btn = document.getElementById('showMoreScenarios');
        if(btn) btn.style.display = 'none';
    }

    function renderToursElements() {
        const grid = document.getElementById('toursGrid');
        if (!grid) return;
        
        let html = '';
        const tourImgs = {
            'sunset': 'assets/Корпоративный отдых/_R004984.jpg',
            'krivets': 'assets/_DSC0247.jpg',
            'sputnik': 'assets/Корпоративный отдых/IMG_4651.jpg'
        };
        
        for (const [id, data] of Object.entries(toursData)) {
            const imgSrc = tourImgs[id] || 'assets/Da-G72KtBUs.jpg';
            html += `
                <div class="tour-card js-open-tour-modal" data-tour-id="${id}" onclick="window.openTourModal('${id}')">
                    <div class="tour-card__img-wrap">
                        <img src="${imgSrc}" alt="${data.title}" class="tour-card__img" style="height:200px; object-fit:cover;">
                        <span class="tour-card__badge">${data.time}</span>
                    </div>
                    <div class="tour-card__content" style="display:flex; flex-direction:column; flex-grow:1;">
                        <h4 class="tour-card__title">${data.title}</h4>
                        <p class="tour-card__desc" style="flex-grow:1;">${data.desc}</p>
                        <button class="tour-card__btn">Подробнее</button>
                    </div>
                </div>`;
        }
        grid.innerHTML = html;
    }
    
    // Globals to manually open modals if click mapping fails
    window.openEquipModal = function(id) {
        const equipModal = document.getElementById('equipDetailModal');
        const data = equipmentData[id];
        if (data && equipModal) {
            document.getElementById('equipModalTitle').textContent = data.title;
            document.getElementById('equipModalDesc').textContent = data.desc;
            const imgContainer = document.getElementById('equipModalImgContainer');
            if (imgContainer && data.images) {
                let html = '<div class="equip-gallery" style="position:relative; width:100%; height:100%; overflow:hidden;">';
                data.images.forEach((imgSrc, idx) => {
                    html += `<img class="modal__pic modal-detail__img gallery-slide" data-idx="${idx}" src="${imgSrc}" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; transition: opacity 0.3s ease; opacity: ${idx === 0 ? '1' : '0'}; z-index: ${idx === 0 ? '2' : '1'};">`;
                });
                if(data.images.length > 1) {
                    html += `
                    <button type="button" onclick="window.changeEquipSlide(-1, event)" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); z-index:10; background:rgba(0,0,0,0.5); color:#fff; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px;">&#10094;</button>
                    <button type="button" onclick="window.changeEquipSlide(1, event)" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); z-index:10; background:rgba(0,0,0,0.5); color:#fff; border:none; width:40px; height:40px; border-radius:50%; cursor:pointer; font-size:20px;">&#10095;</button>`;
                }
                html += '</div>';
                imgContainer.innerHTML = html;
            } else if (data.img) {
               imgContainer.innerHTML = `<img src="${data.img}" class="modal-detail__img" style="width:100%; height:100%; object-fit:cover;">`;
            }
            
            const priceEl = document.getElementById('equipModalPrice');
            if(priceEl) { priceEl.textContent = data.price; }
            
            const specsContainer = document.getElementById('equipModalSpecs');
            if(specsContainer) {
                specsContainer.innerHTML = '';
                if(data.specs) {
                    data.specs.forEach(spec => {
                        specsContainer.innerHTML += `<li><strong>${spec.label}</strong><span>${spec.value}</span></li>`;
                    });
                }
            }
            equipModal.classList.add('active');
        }
    };
    
    window.openTourModal = function(tourId) {
        const tourModal = document.getElementById('tourDetailModal');
        const data = toursData[tourId];
        if (data && tourModal) {
            document.getElementById('tourModalTitle').textContent = data.title;
            document.getElementById('tourModalTime').textContent = data.time;
            document.getElementById('tourModalDesc').textContent = data.desc;
            
            const specsContainer = document.getElementById('tourModalSpecs');
            if(specsContainer) {
                specsContainer.innerHTML = '';
                if(data.specs) {
                    data.specs.forEach(spec => {
                        specsContainer.innerHTML += `<li><strong>${spec.label}</strong><span>${spec.value}</span></li>`;
                    });
                }
            }
            tourModal.classList.add('active');
        }
    };

    // ========================================
    // Reviews Slider Logic (Infinite & Drag)
    // ========================================
    const reviewsSlider = document.getElementById('reviewsSlider');
    const prevBtn = document.querySelector('.reviews__slider-nav.prev');
    const nextBtn = document.querySelector('.reviews__slider-nav.next');
    const dots = document.querySelectorAll('.reviews__dot');

    if (reviewsSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let cardWidth = 0;

        // --- Calculate Card Width Correctly ---
        const updateCardWidth = () => {
            const card = reviewsSlider.querySelector('.reviews__card');
            if (card) {
                // width + gap
                const style = window.getComputedStyle(reviewsSlider);
                const gap = parseFloat(style.gap) || 0;
                cardWidth = card.offsetWidth + gap;
            } else {
                cardWidth = 350;
            }
        };

        updateCardWidth();
        window.addEventListener('resize', updateCardWidth);

        // --- Drag Functionality (Mouse) ---
        reviewsSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            reviewsSlider.style.cursor = 'grabbing';
            startX = e.pageX - reviewsSlider.offsetLeft;
            scrollLeft = reviewsSlider.scrollLeft;
            // Disable scroll snap and smooth behavior so drag goes smoothly
            reviewsSlider.style.scrollSnapType = 'none';
            reviewsSlider.style.scrollBehavior = 'auto';
        });

        const stopDrag = () => {
            if (!isDown) return;
            isDown = false;
            reviewsSlider.style.cursor = 'grab';
            
            // Snap to nearest card upon drop
            if (cardWidth > 0) {
                const nearestIndex = Math.round(reviewsSlider.scrollLeft / cardWidth);
                reviewsSlider.style.scrollBehavior = 'smooth';
                reviewsSlider.scrollLeft = nearestIndex * cardWidth;
            }
            
            // Re-enable scroll snap after slight delay to allow smooth transit
            setTimeout(() => {
                // Ensure it's not snagged by another mousedown
                if (!isDown) reviewsSlider.style.scrollSnapType = 'x mandatory';
            }, 300);
        };

        reviewsSlider.addEventListener('mouseleave', stopDrag);
        reviewsSlider.addEventListener('mouseup', stopDrag);

        reviewsSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - reviewsSlider.offsetLeft;
            const walk = (x - startX) * 1.5; // Drag speed
            reviewsSlider.scrollLeft = scrollLeft - walk;
        });

        // --- Navigation Logic ---
        function moveSlider(direction) {
            if (cardWidth === 0) updateCardWidth();
            const containerWidth = reviewsSlider.offsetWidth;
            const scrollWidth = reviewsSlider.scrollWidth;
            const maxScroll = scrollWidth - containerWidth;

            reviewsSlider.style.scrollBehavior = 'smooth';

            if (direction === 'next') {
                if (reviewsSlider.scrollLeft + containerWidth >= scrollWidth - 10) {
                    reviewsSlider.scrollLeft = 0;
                } else {
                    reviewsSlider.scrollLeft += cardWidth;
                }
            } else if (direction === 'prev') {
                if (reviewsSlider.scrollLeft <= 10) {
                    reviewsSlider.scrollLeft = maxScroll;
                } else {
                    reviewsSlider.scrollLeft -= cardWidth;
                }
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                moveSlider('next');
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                moveSlider('prev');
            });
        }

        // --- Pagination Dots Logic (Throttled/Optimized) ---
        let scrollTicking = false;
        const updateDots = () => {
            if (cardWidth === 0) return;
            const scrollPos = reviewsSlider.scrollLeft;
            const index = Math.round(scrollPos / cardWidth);

            dots.forEach((dot, i) => {
                if (i === index) {
                    if (!dot.classList.contains('active')) dot.classList.add('active');
                } else {
                    if (dot.classList.contains('active')) dot.classList.remove('active');
                }
            });
            scrollTicking = false;
        };

        reviewsSlider.addEventListener('scroll', () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(updateDots);
                scrollTicking = true;
            }
        });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                if (cardWidth === 0) updateCardWidth();
                reviewsSlider.style.scrollBehavior = 'smooth';
                reviewsSlider.scrollLeft = i * cardWidth;
            });
        });
    }

    // ========================================
    // Equipment Filters Logic
    // ========================================
    const filterBtns = document.querySelectorAll('.equipment__filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => {
                    b.classList.remove('hero__button_primary');
                    b.classList.add('hero__button_secondary');
                    b.style.background = '#fff';
                    b.style.color = 'var(--brand-blue)';
                });
                
                e.target.classList.remove('hero__button_secondary');
                e.target.classList.add('hero__button_primary');
                e.target.style.background = '';
                e.target.style.color = '';
                
                const filter = e.target.getAttribute('data-filter');
                renderEquipmentElements(filter);
            });
        });
    }

    // ========================================
    // Phone Mask Logic
    // ========================================
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let val = e.target.value.replace(/\D/g, '');
            if (!val) {
                e.target.value = '';
                return;
            }
            if (val[0] === '7' || val[0] === '8') val = val.substring(1);
            let x = val.match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = '+7' + (x[1] ? ' (' + x[1] : '') + (x[2] ? ') ' + x[2] : '') + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
        });
    });

    // ========================================
    // Scroll Spy for Nav Links
    // ========================================
    const spySections = document.querySelectorAll('section[id]');
    const spyNavLinks = document.querySelectorAll('.nav__link');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;
        spySections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        spyNavLinks.forEach(link => {
            link.style.color = ''; // Reset
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--brand-orange)';
            }
        });
    }, { passive: true });

    // Render dynamic sections
    renderEquipmentElements();
    renderScenariosElements();
    renderToursElements();

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
