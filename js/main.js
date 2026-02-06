document.addEventListener('DOMContentLoaded', function() {

    // Navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.getElementById('nav');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                const offset = 70;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active section highlighting
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + section.offsetHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    // Nav background
    function updateNav() {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.97)';
            nav.style.boxShadow = '0 1px 8px rgba(0, 0, 0, 0.04)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.92)';
            nav.style.boxShadow = 'none';
        }
    }

    // Scroll animations
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.about-section, .journey-section, .ventures-section, .research-section, .proof-section, .connect-section').forEach(section => {
        section.classList.add('fade-in');
        fadeObserver.observe(section);
    });

    // Staggered card animations
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.credential-card, .venture-card, .publication-card, .proof-quote');
                cards.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    card.style.transition = 'opacity 0.4s ease ' + (i * 0.08) + 's, transform 0.4s ease ' + (i * 0.08) + 's';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    });
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.about-credentials, .ventures-grid, .publications, .proof-grid').forEach(container => {
        cardObserver.observe(container);
    });

    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease ' + (i * 0.1) + 's, transform 0.5s ease ' + (i * 0.1) + 's';
        timelineObserver.observe(item);
    });

    // Scroll listener
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                highlightActiveSection();
                updateNav();
                ticking = false;
            });
            ticking = true;
        }
    });

    highlightActiveSection();
    updateNav();

    // Hero fade-in
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        setTimeout(function() {
            hero.style.transition = 'opacity 0.8s ease';
            hero.style.opacity = '1';
        }, 50);
    }

    // Dynamic year
    const copyright = document.querySelector('.footer-copyright');
    if (copyright) {
        copyright.textContent = '\u00A9 ' + new Date().getFullYear() + ' Zhirayr Gumruyan';
    }

    // Reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('*').forEach(el => {
            el.style.transitionDuration = '0.01s';
            el.style.animationDuration = '0.01s';
        });
    }
});
