// Main JavaScript for Portfolio Website

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
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
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

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
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Navigation background on scroll
    function updateNavBackground() {
        const nav = document.getElementById('nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.05)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }
    }

    // Scroll event listeners
    window.addEventListener('scroll', function() {
        highlightActiveSection();
        updateNavBackground();
    });

    // Initial call
    highlightActiveSection();
    updateNavBackground();

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply fade-in animation to sections
    const animatedSections = document.querySelectorAll('.about, .projects, .thoughts, .contact');
    animatedSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Project card hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Dynamic year in footer
    const yearElement = document.querySelector('.footer p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }

    // Twitter timeline load fallback
    setTimeout(() => {
        const twitterContainer = document.querySelector('.twitter-container');
        if (twitterContainer && !twitterContainer.querySelector('iframe')) {
            // If Twitter widget hasn't loaded, show a fallback message
            const fallback = document.createElement('div');
            fallback.style.textAlign = 'center';
            fallback.style.padding = '2rem';
            fallback.innerHTML = `
                <p style="color: #525252; margin-bottom: 1rem;">Twitter feed is loading...</p>
                <a href="https://twitter.com/gumruyanzh" target="_blank" style="color: #000; text-decoration: underline;">View on Twitter</a>
            `;
            twitterContainer.appendChild(fallback);
        }
    }, 5000);

    // Parallax effect for hero section (subtle)
    const hero = document.querySelector('.hero-content');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * -0.3;
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Typewriter effect for hero title (optional, subtle)
    const heroTitle = document.querySelector('.hero-name');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.display = 'inline-block';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        // Start typewriter after a short delay
        setTimeout(typeWriter, 500);
    }
});

// Page visibility API to pause animations when tab is not active
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations
        document.body.style.animationPlayState = 'paused';
    } else {
        // Page is visible, resume animations
        document.body.style.animationPlayState = 'running';
    }
});