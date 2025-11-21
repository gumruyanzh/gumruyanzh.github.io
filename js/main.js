// ===================================
// MODERN PORTFOLIO - ZHIRAYR GUMRUYAN
// Enhanced JavaScript Interactions
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // NAVIGATION
    // ===================================

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.getElementById('nav');

    // Mobile Navigation Toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // Height of fixed nav
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Navigation background on scroll
    function updateNavBackground() {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }
    }

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================

    // IntersectionObserver for fade-in animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Only observe once
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in animation to sections
    const sectionsToAnimate = [
        '.story-section',
        '.milestones-section',
        '.projects-showcase',
        '.thoughts-section',
        '.connect-section'
    ];

    sectionsToAnimate.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            section.classList.add('fade-in');
            fadeObserver.observe(section);
        }
    });

    // Animate timeline items individually
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    });

    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // Animate project cards
    const projectCards = document.querySelectorAll('.project-card-new');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    });

    const projectsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                projectsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    projectCards.forEach(card => {
        projectsObserver.observe(card);
    });

    // ===================================
    // SCROLL INDICATOR
    // ===================================

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }

    // ===================================
    // PARALLAX EFFECT (SUBTLE)
    // ===================================

    const heroContent = document.querySelector('.hero-full-content');
    if (heroContent) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const rate = scrolled * -0.2;
                heroContent.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // ===================================
    // PROJECT CARD INTERACTIONS
    // ===================================

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===================================
    // CONNECT OPTIONS INTERACTION
    // ===================================

    const connectOptions = document.querySelectorAll('.connect-option');
    connectOptions.forEach(option => {
        option.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        option.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===================================
    // SCROLL EVENT LISTENERS
    // ===================================

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                highlightActiveSection();
                updateNavBackground();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial calls
    highlightActiveSection();
    updateNavBackground();

    // ===================================
    // DYNAMIC YEAR IN FOOTER
    // ===================================

    const footerCopyright = document.querySelector('.footer-copyright');
    if (footerCopyright) {
        const currentYear = new Date().getFullYear();
        footerCopyright.textContent = `© ${currentYear} Zhirayr Gumruyan. All rights reserved.`;
    }

    // ===================================
    // NEWSLETTER TOPICS ANIMATION
    // ===================================

    const newsletterTopics = document.querySelectorAll('.newsletter-topic');
    newsletterTopics.forEach((topic, index) => {
        topic.style.opacity = '0';
        topic.style.transform = 'scale(0.9)';
        topic.style.transition = `opacity 0.3s ease ${index * 0.05}s, transform 0.3s ease ${index * 0.05}s`;
    });

    const topicsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const topics = entry.target.querySelectorAll('.newsletter-topic');
                topics.forEach(topic => {
                    topic.style.opacity = '1';
                    topic.style.transform = 'scale(1)';
                });
                topicsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const newsletterCard = document.querySelector('.newsletter-card-large');
    if (newsletterCard) {
        topicsObserver.observe(newsletterCard);
    }

    // ===================================
    // SOCIAL LINKS ANIMATION
    // ===================================

    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        link.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
    });

    const socialObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const links = document.querySelectorAll('.social-link');
                links.forEach(link => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                });
                socialObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const socialLinksContainer = document.querySelector('.social-links');
    if (socialLinksContainer) {
        socialObserver.observe(socialLinksContainer);
    }

    // ===================================
    // PROFILE CARD ANIMATION
    // ===================================

    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.style.opacity = '0';
        profileCard.style.transform = 'translateX(30px)';
        profileCard.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';

        const profileObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    profileObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        profileObserver.observe(profileCard);
    }

    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.body.style.animationPlayState = 'paused';
        } else {
            document.body.style.animationPlayState = 'running';
        }
    });

    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        // Disable parallax and complex animations
        if (heroContent) {
            window.removeEventListener('scroll', function() {});
        }

        // Make all animations instant
        document.querySelectorAll('*').forEach(el => {
            el.style.transitionDuration = '0.01s';
            el.style.animationDuration = '0.01s';
        });
    }

    // ===================================
    // KEYBOARD NAVIGATION
    // ===================================

    // Focus visible for keyboard users
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // ===================================
    // SMOOTH REVEAL ON PAGE LOAD
    // ===================================

    // Fade in the hero section
    const heroFull = document.querySelector('.hero-full');
    if (heroFull) {
        heroFull.style.opacity = '0';
        setTimeout(function() {
            heroFull.style.transition = 'opacity 1s ease';
            heroFull.style.opacity = '1';
        }, 100);
    }

    console.log('Portfolio loaded successfully ✓');
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
