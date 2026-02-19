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

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Unified Modal Open Logic
    document.addEventListener('click', (e) => {
        // Handle elements with .js-open-modal or inside one
        const btn = e.target.closest('.js-open-modal');
        if (btn) {
            e.preventDefault();
            openModal();
        }
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeModalOverlay) closeModalOverlay.addEventListener('click', closeModal);

    // ========================================
    // Smooth Scroll for Anchors
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
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
    // Gallery Polaroid Carousel
    // ========================================
    const galleryTrack = document.getElementById('galleryTrack');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const galleryDots = document.querySelectorAll('.gallery__dot');
    const polaroids = document.querySelectorAll('.gallery__polaroid');

    if (galleryTrack && polaroids.length > 0) {
        let currentSlide = 0;

        function updateDots(index) {
            galleryDots.forEach((dot, i) => {
                dot.classList.toggle('gallery__dot--active', i === index);
            });
        }

        function scrollToSlide(index) {
            if (index < 0) index = 0;
            if (index >= polaroids.length) index = polaroids.length - 1;
            currentSlide = index;

            const polaroid = polaroids[index];
            const scrollLeft = polaroid.offsetLeft - (galleryTrack.offsetWidth / 2) + (polaroid.offsetWidth / 2);
            galleryTrack.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            updateDots(index);
        }

        if (galleryPrev) {
            galleryPrev.addEventListener('click', () => {
                scrollToSlide(currentSlide - 1);
            });
        }

        if (galleryNext) {
            galleryNext.addEventListener('click', () => {
                scrollToSlide(currentSlide + 1);
            });
        }

        // Dots click
        galleryDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                scrollToSlide(index);
            });
        });

        // Scroll sync with dots
        galleryTrack.addEventListener('scroll', () => {
            const scrollCenter = galleryTrack.scrollLeft + galleryTrack.offsetWidth / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;

            polaroids.forEach((polaroid, index) => {
                const polaroidCenter = polaroid.offsetLeft + polaroid.offsetWidth / 2;
                const distance = Math.abs(scrollCenter - polaroidCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            if (closestIndex !== currentSlide) {
                currentSlide = closestIndex;
                updateDots(currentSlide);
            }
        });
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

    // Check for success parameter in URL (from PHP redirection)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'success') {
        alert('Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

