document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    let ticking = false;

    function updateAboutHeroScrollEffects() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const aboutHero = document.querySelector('.about-hero');

        if (!aboutHero) return;

        const heroRect = aboutHero.getBoundingClientRect();
        const heroHeight = aboutHero.offsetHeight;
        const scrollProgress = Math.min(Math.max(scrolled / (heroHeight * 0.8), 0), 1);

        const heroContent = document.querySelector('.about-hero .hero-content');
        if (heroContent) {
            const translateY = scrollProgress * -50;
            const opacity = 1 - (scrollProgress * 0.6);
            const scale = 1 - (scrollProgress * 0.05);
            heroContent.style.transform = `translateY(${translateY}px) scale(${scale})`;
            heroContent.style.opacity = Math.max(opacity, 0.3);
        }

        const floatingParticles = document.querySelector('.floating-particles');
        if (floatingParticles) {
            const translateY = scrollProgress * 30;
            const opacity = 1 - (scrollProgress * 0.4);
            floatingParticles.style.transform = `translateY(${translateY}px)`;
            floatingParticles.style.opacity = Math.max(opacity, 0.5);
        }

        const geometricShapes = document.querySelectorAll('.geometric-bg .shape');
        geometricShapes.forEach((shape, index) => {
            const speed = 0.3 + (index * 0.1);
            const direction = index % 2 === 0 ? 1 : -1;
            const translateY = scrolled * speed * 0.15;
            const rotate = scrolled * 0.05 * direction;
            const opacity = 1 - (scrollProgress * 0.5);
            shape.style.transform = `translateY(${translateY}px) rotate(${rotate}deg)`;
            shape.style.opacity = Math.max(opacity, 0.2);
        });
    }

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const viewportHeight = window.innerHeight;

        updateAboutHeroScrollEffects();

        const cards = document.querySelectorAll('.skill-category, .timeline-item, .philosophy-item, .profile-card');
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = (cardCenter - viewportCenter) / viewportHeight;
            const parallaxOffset = distance * 15;

            if (rect.top < viewportHeight && rect.bottom > 0) {
                card.style.transform = `translateY(${parallaxOffset}px)`;
            }
        });

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestParallaxUpdate);

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const hero = entry.target;
            if (entry.isIntersecting) {
                hero.classList.add('hero-active');
            } else {
                hero.classList.remove('hero-active');
            }
        });
    }, {
        rootMargin: '50px',
        threshold: [0, 0.1, 0.5, 1]
    });

    const aboutHeroSection = document.querySelector('.about-hero');
    if (aboutHeroSection) {
        heroObserver.observe(aboutHeroSection);
    }

const observerOptions = {
    threshold: [0, 0.1, 0.3, 0.5],
    rootMargin: '-50px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const delay = element.dataset.delay || 0;

            setTimeout(() => {
                element.classList.add('fade-in-active');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
                element.style.filter = 'blur(0)';
            }, delay);
        }
    });
}, observerOptions);

const fadeElements = document.querySelectorAll('.skill-category, .timeline-item, .philosophy-item, .highlight-item, .profile-card, .soft-skills-section');
fadeElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px) scale(0.95)';
    el.style.filter = 'blur(5px)';
    el.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease';
    el.dataset.delay = index * 50;
    fadeInObserver.observe(el);
});

    function animateCounter(element, target, duration = 2500) {
        let start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);

            const originalText = element.getAttribute('data-original') || element.textContent;
            const suffix = originalText.includes('+') ? '+' : originalText.includes('%') ? '%' : '';
            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.hasAttribute('data-animated')) {
                    statNumber.setAttribute('data-animated', 'true');
                    const text = statNumber.textContent;
                    statNumber.setAttribute('data-original', text);
                    const number = parseInt(text.match(/\d+/)[0]);
                    statNumber.textContent = '0' + text.replace(/\d+/, '');

                    setTimeout(() => {
                        animateCounter(statNumber, number);
                    }, 300);
                }
            }
        });
    }, { threshold: 0.3 });

    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });

    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
        });

        category.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });

        category.addEventListener('mouseenter', function() {
            skillCategories.forEach((otherCategory, otherIndex) => {
                if (otherIndex !== index) {
                    otherCategory.style.opacity = '0.7';
                    otherCategory.style.transform = 'scale(0.98)';
                }
            });
        });

        category.addEventListener('mouseleave', function() {
            skillCategories.forEach(otherCategory => {
                otherCategory.style.opacity = '1';
                otherCategory.style.transform = 'scale(1)';
            });
        });
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const marker = this.querySelector('.timeline-marker');
            const content = this.querySelector('.timeline-content');
            if (marker) {
                marker.style.transform = 'scale(1.2)';
                marker.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
            }
            if (content) {
                content.style.transform = 'translateX(10px)';
                content.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const marker = this.querySelector('.timeline-marker');
            const content = this.querySelector('.timeline-content');
            if (marker) {
                marker.style.transform = 'scale(1)';
                marker.style.boxShadow = 'none';
            }
            if (content) {
                content.style.transform = 'translateX(0)';
                content.style.boxShadow = 'none';
            }
        });
    });

    const skillProgressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillProgress = entry.target.querySelector('.skill-progress');
                if (skillProgress && !skillProgress.hasAttribute('data-animated')) {
                    skillProgress.setAttribute('data-animated', 'true');
                    const width = skillProgress.getAttribute('data-width');
                    setTimeout(() => {
                        skillProgress.style.width = width;
                    }, 300);
                }
            }
        });
    }, { threshold: 0.3 });

    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        skillProgressObserver.observe(item);
    });

    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            z-index: 1000;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrollProgress + '%';
        });
    }

    createScrollProgress();

    const magneticButtons = document.querySelectorAll('.btn');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });

    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        profileCard.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    }

    const philosophyItems = document.querySelectorAll('.philosophy-item');
    philosophyItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.philosophy-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotateY(10deg)';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.philosophy-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotateY(0deg)';
            }
        });
    });

    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-active');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.transition = 'opacity 1s ease, transform 1s ease';
        sectionObserver.observe(section);
    });

    function preloadImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }

    preloadImages();

    let konamiCode = [];
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konami.length) {
            konamiCode.shift();
        }

        if (konamiCode.join(',') === konami.join(',')) {
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0%, 100% { filter: hue-rotate(0deg); }
            50% { filter: hue-rotate(360deg); }
        }

        .scroll-progress {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .section-active {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .fade-in-active {
            opacity: 1 !important;
            transform: translateY(0) scale(1) !important;
            filter: blur(0) !important;
        }

        .hero-active .hero-content {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                        opacity 0.3s ease,
                        filter 0.3s ease;
        }

        .hero-content {
            will-change: transform, opacity;
            transition: transform 0.1s ease-out, opacity 0.1s ease-out;
        }

        .floating-particles {
            will-change: transform, opacity;
            transition: transform 0.1s ease-out, opacity 0.1s ease-out;
        }

        .geometric-bg .shape {
            will-change: transform, opacity;
            transition: transform 0.1s ease-out, opacity 0.1s ease-out;
        }

        .skill-category,
        .timeline-item,
        .philosophy-item,
        .profile-card {
            will-change: transform;
            transition: transform 0.3s ease;
        }

        .skill-progress {
            transition: width 2s ease-out;
        }

        @media (max-width: 768px) {
            .hero-content,
            .floating-particles,
            .geometric-bg .shape {
                transition: transform 0.2s ease-out, opacity 0.2s ease-out;
            }
        }
    `;
    document.head.appendChild(style);
});