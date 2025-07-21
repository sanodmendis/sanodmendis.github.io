const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

if (!isTouchDevice) {
    document.querySelectorAll('.skill-category').forEach((card, i, all) => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            card.style.transform = `perspective(1000px) rotateX(${y / 15}deg) rotateY(${-x / 15}deg) translateY(-5px) scale(1.02)`;
        });

        card.addEventListener('mouseenter', () => {
            all.forEach((c, j) => {
                if (j !== i) {
                    c.style.opacity = '0.7';
                    c.style.transform = 'scale(0.98)';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            all.forEach(c => {
                c.style.opacity = '1';
                c.style.transform = 'scale(1)';
            });
        });
    });

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const scrollThrottle = 100;
    let lastScrollTime = 0, scrollTimeout, ticking = false;

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    function onScroll() {
        const now = Date.now();
        if (now - lastScrollTime >= scrollThrottle) {
            requestParallaxUpdate();
            lastScrollTime = now;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.querySelectorAll('.hero-content, .floating-particles, .geometric-bg .shape').forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 300);
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const ease = v => 1 - Math.pow(1 - v, 4);

        const hero = document.querySelector('.about-hero');
        if (hero) {
            const heroContent = hero.querySelector('.hero-content');
            const floatingParticles = document.querySelector('.floating-particles');
            const shapes = document.querySelectorAll('.geometric-bg .shape');
            const scrollDist = Math.max(hero.offsetHeight + windowHeight * 0.3, 400);
            const progress = Math.min(Math.max(scrolled / scrollDist, 0), 1);
            const eased = ease(progress);

            if (heroContent) {
                heroContent.style.transform = `translateY(${-30 * eased}px) scale(${1 - eased * 0.03})`;
                heroContent.style.opacity = `${1 - eased * 0.4}`;
            }

            if (floatingParticles) {
                floatingParticles.style.transform = `translateY(${20 * eased}px)`;
                floatingParticles.style.opacity = `${1 - eased * 0.3}`;
            }

            shapes.forEach((shape, i) => {
                const speed = 0.2 + i * 0.05;
                shape.style.transform = `translateY(${scrolled * speed * 0.1}px) rotate(${scrolled * 0.03 * (i % 2 ? -1 : 1)}deg)`;
                shape.style.opacity = `${1 - eased * 0.3}`;
            });
        }

        if (!isTouchDevice) {
            document.querySelectorAll('.skill-category, .timeline-item, .philosophy-item, .profile-card').forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const dist = (rect.top + rect.height / 2 - windowHeight / 2) / windowHeight;
                    card.style.transform = `translateY(${dist * 15}px)`;
                }
            });
        }

        ticking = false;
    }

    const fadeInObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('fade-in-active');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0) scale(1)';
                el.style.filter = 'blur(0)';
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-category, .timeline-item, .philosophy-item, .highlight-item, .profile-card, .soft-skills-section')
        .forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px) scale(0.95)';
            el.style.filter = 'blur(5px)';
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease';
            el.dataset.delay = i * 50;
            fadeInObserver.observe(el);
        });

    const hero = document.querySelector('.about-hero');
    if (hero) {
        new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle('hero-active', entry.isIntersecting);
            });
        }, { rootMargin: '50px', threshold: 0.1 }).observe(hero);
    }

    const statObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const stat = entry.target.querySelector('.stat-number');
            if (entry.isIntersecting && stat && !stat.dataset.animated) {
                stat.dataset.animated = 'true';
                const target = parseInt(stat.textContent.replace(/\D/g, ''));
                const start = performance.now();
                requestAnimationFrame(function animate(t) {
                    const progress = Math.min((t - start) / 1500, 1);
                    stat.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 4)));
                    if (progress < 1) requestAnimationFrame(animate);
                });
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stat-item').forEach(el => statObserver.observe(el));

    if (!isTouchDevice) {
        document.querySelectorAll('.skill-category').forEach((card, i, all) => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                card.style.transform = `perspective(1000px) rotateX(${y / 15}deg) rotateY(${-x / 15}deg) translateY(-5px) scale(1.02)`;
            });

            card.addEventListener('mouseenter', () => {
                all.forEach((c, j) => {
                    if (j !== i) {
                        c.style.opacity = '0.7';
                        c.style.transform = 'scale(0.98)';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                all.forEach(c => {
                    c.style.opacity = '1';
                    c.style.transform = 'scale(1)';
                });
            });
        });

        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.querySelector('.timeline-marker')?.style.setProperty('transform', 'scale(1.2)');
                item.style.zIndex = '1'; 
            });
            item.addEventListener('mouseleave', () => {
                item.querySelector('.timeline-marker')?.style.setProperty('transform', 'scale(1)');
                item.style.zIndex = '0'; 
            });
        });

        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        document.querySelectorAll('.philosophy-item').forEach(item => {
            const icon = item.querySelector('.philosophy-icon');
            item.addEventListener('mouseenter', () => {
                if (icon) icon.style.transform = 'scale(1.1) rotateY(10deg)';
            });
            item.addEventListener('mouseleave', () => {
                if (icon) icon.style.transform = 'scale(1) rotateY(0)';
            });
        });
    }

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-active');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(sec => {
        sec.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        sectionObserver.observe(sec);
    });

    const lazyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const img = entry.target;
            if (entry.isIntersecting && img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.style.opacity = '1';
            }
        });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
        lazyObserver.observe(img);
    });

    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.style.cssText = `
        position: fixed; top: 0; left: 0; width: 0%; height: 3px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6); z-index: 1000;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        transition: width 0.2s ease;
    `;
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = `${(window.scrollY / h) * 100}%`;
    });

    window.addEventListener('beforeunload', () => {
        window.removeEventListener('scroll', onScroll);
        document.querySelectorAll('.skill-category, .timeline-item, .philosophy-item, .profile-card').forEach(el => {
            el.style.transition = 'none';
            el.style.transform = 'none';
        });
    });

    window.addEventListener('scroll', onScroll);
});