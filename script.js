document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // Smart Sticky Header
    // ========================================
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 600;

        // Add/remove scrolled class for background change
        if (currentScrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        // Hide/show header based on scroll direction (only after passing hero)
        if (currentScrollY > heroHeight) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling DOWN
                header.classList.add('header--hidden');
            } else {
                // Scrolling UP
                header.classList.remove('header--hidden');
            }
        } else {
            header.classList.remove('header--hidden');
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
    const openModalBtn = document.getElementById('openModal');
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

    if (openModalBtn) openModalBtn.addEventListener('click', openModal);

    // Footer CTA button
    const footerBookBtn = document.getElementById('footerBookBtn');
    if (footerBookBtn) footerBookBtn.addEventListener('click', openModal);
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
});
