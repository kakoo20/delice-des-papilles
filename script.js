/**
 * DÉLICE DES PAPILLES — Modern JavaScript
 * Smooth animations, interactions, and scroll behaviors
 */

(function() {
    'use strict';

    // ========================================
    // CONFIG
    // ========================================
    const CONFIG = {
        scrollOffset: 100,
        revealThreshold: 0.1,
        revealRootMargin: '0px 0px -50px 0px',
        loaderDuration: 2000,
        magneticStrength: 0.3
    };

    // ========================================
    // DOM ELEMENTS
    // ========================================
    const elements = {
        loader: document.getElementById('loader'),
        navbar: document.getElementById('navbar'),
        mobileMenu: document.getElementById('mobile-menu'),
        mobileToggle: document.querySelector('.mobile-toggle'),
        cursor: document.getElementById('cursor'),
        cursorFollower: document.getElementById('cursor-follower'),
        heroTitle: document.querySelector('.hero-title'),
        menuGrid: document.getElementById('menuGrid'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        revealElements: document.querySelectorAll('[data-reveal]')
    };

    // ========================================
    // LOADER
    // ========================================
    function initLoader() {
        const textSpans = document.querySelectorAll('.loader-text span:not(.space)');
        textSpans.forEach((span, i) => {
            span.style.animationDelay = `${i * 0.05}s`;
        });

        window.addEventListener('load', () => {
            setTimeout(() => {
                elements.loader.classList.add('hidden');
                document.body.style.overflow = '';
                initHeroReveal();
            }, CONFIG.loaderDuration);
        });
    }

    // ========================================
    // CUSTOM CURSOR
    // ========================================
    function initCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            elements.cursor.style.left = cursorX + 'px';
            elements.cursor.style.top = cursorY + 'px';
            elements.cursorFollower.style.left = followerX + 'px';
            elements.cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const hoverTargets = document.querySelectorAll('a, button, .magnetic, .menu-card, .review-card, .bento-card');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                elements.cursor.classList.add('hover');
                elements.cursorFollower.classList.add('hover');
            });
            target.addEventListener('mouseleave', () => {
                elements.cursor.classList.remove('hover');
                elements.cursorFollower.classList.remove('hover');
            });
        });
    }

    // ========================================
    // MAGNETIC BUTTONS
    // ========================================
    function initMagneticButtons() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const magneticElements = document.querySelectorAll('.magnetic');

        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                el.style.transform = `translate(${x * CONFIG.magneticStrength}px, ${y * CONFIG.magneticStrength}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    function initNavbar() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                elements.navbar.classList.add('scrolled');
            } else {
                elements.navbar.classList.remove('scrolled');
            }

            // Hide/show on scroll direction
            if (currentScroll > lastScroll && currentScroll > 200) {
                elements.navbar.style.transform = 'translateY(-100%)';
            } else {
                elements.navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        }, { passive: true });

        // Active nav link based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
    }

    // ========================================
    // MOBILE MENU
    // ========================================
    window.toggleMenu = function() {
        elements.mobileMenu.classList.toggle('active');
        elements.mobileToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    };

    // ========================================
    // HERO TEXT REVEAL
    // ========================================
    function initHeroReveal() {
        if (!elements.heroTitle) return;

        const lines = elements.heroTitle.querySelectorAll('.line');
        lines.forEach((line, i) => {
            const text = line.textContent;
            line.innerHTML = '';

            const span = document.createElement('span');
            span.textContent = text;
            span.style.transitionDelay = `${0.3 + i * 0.15}s`;
            line.appendChild(span);
        });

        setTimeout(() => {
            elements.heroTitle.classList.add('revealed');
        }, 100);
    }

    // ========================================
    // SCROLL REVEAL (Intersection Observer)
    // ========================================
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.revealThreshold,
            rootMargin: CONFIG.revealRootMargin
        });

        elements.revealElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // MENU FILTERING
    // ========================================
    function initMenuFilter() {
        elements.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                elements.tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.dataset.category;
                const items = elements.menuGrid.querySelectorAll('.menu-card');

                items.forEach((item, index) => {
                    const itemCategory = item.dataset.category;

                    if (category === 'all' || itemCategory === category) {
                        item.classList.remove('hidden');
                        item.style.animation = `none`;
                        item.offsetHeight; // Trigger reflow
                        item.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s both`;
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ========================================
    // PARALLAX EFFECTS
    // ========================================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.hero-bg-img, .about-bg-text');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = el.classList.contains('hero-bg-img') ? 0.3 : 0.1;
                el.style.transform = `translateY(${scrollY * speed}px) ${el.classList.contains('hero-bg-img') ? 'scale(1.1)' : ''}`;
            });
        }, { passive: true });
    }

    // ========================================
    // TEXT SCRAMBLE EFFECT (for fun on hover)
    // ========================================
    function initTextScramble() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        document.querySelectorAll('.logo-title').forEach(el => {
            const originalText = el.textContent;
            let interval;

            el.parentElement.parentElement.addEventListener('mouseenter', () => {
                let iteration = 0;
                clearInterval(interval);

                interval = setInterval(() => {
                    el.textContent = originalText
                        .split('')
                        .map((char, index) => {
                            if (index < iteration) return originalText[index];
                            if (char === ' ') return ' ';
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join('');

                    if (iteration >= originalText.length) clearInterval(interval);
                    iteration += 1/2;
                }, 30);
            });

            el.parentElement.parentElement.addEventListener('mouseleave', () => {
                clearInterval(interval);
                el.textContent = originalText;
            });
        });
    }

    // ========================================
    // ANIMATION KEYFRAMES (injected)
    // ========================================
    function injectKeyframes() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // GOOGLE MAPS DIRECTIONS
    // ========================================
    window.openMap = function() {
        window.open('https://maps.app.goo.gl/ALEvUc21nsCSx7n49', '_blank');
    };

    // ========================================
    // INITIALIZE EVERYTHING
    // ========================================
    function init() {
        document.body.style.overflow = 'hidden'; // Prevent scroll during load

        injectKeyframes();
        initLoader();
        initCursor();
        initMagneticButtons();
        initNavbar();
        initScrollReveal();
        initSmoothScroll();
        initMenuFilter();
        initParallax();
        initTextScramble();

        console.log('%c Délice des Papilles ', 'background: #D4A853; color: #0A0A0A; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
        console.log('%c Website loaded successfully ', 'color: #D4A853; font-size: 12px;');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
