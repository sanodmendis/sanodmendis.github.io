document.addEventListener('DOMContentLoaded', function() {

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    const disableEffects = isTouchDevice || isSmallScreen;

    const glassCards = document.querySelectorAll('.glass-card');
    const contactItems = document.querySelectorAll('.contact-item');
    const socialLinks = document.querySelectorAll('.social-link');
    const fadeElements = document.querySelectorAll('.glass-card, .contact-item, .social-link');

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
            will-change: width;
        `;
        document.body.appendChild(progressBar);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollProgress = (window.scrollY / scrollHeight) * 100;
                    progressBar.style.width = scrollProgress + '%';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    createScrollProgress();

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;

                setTimeout(() => {
                    element.classList.add('fade-in-active');
                    element.style.opacity = '1';
                    element.style.transform = 'translate3d(0, 0, 0) scale(1)';
                    element.style.filter = 'blur(0)';
                    element.style.willChange = ''; 
                }, delay);
            }
        });
    }, { threshold: 0.1 });

    if (!disableEffects) {
        fadeElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translate3d(0, 40px, 0) scale(0.95)';
            el.style.filter = 'blur(5px)';
            el.style.willChange = 'opacity, transform, filter';
            el.dataset.delay = index * 100;
            fadeInObserver.observe(el);
        });
    } else {

        fadeElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.filter = 'none';
        });
    }

    if (!disableEffects) {
        glassCards.forEach((card, index) => {
            let lastTime = 0;
            const throttleDelay = 16;

            card.addEventListener('mousemove', function(e) {
                const now = Date.now();
                if (now - lastTime >= throttleDelay) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;

                    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(0, -10px, 0) scale(1.02)`;
                    lastTime = now;
                }
            }, { passive: true });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translate3d(0, 0, 0) scale(1)';
            });
        });

        contactItems.forEach(item => {
            const type = item.querySelector('.contact-icon i').className.split(' ')[1];
            let color;

            switch(type) {
                case 'fa-phone':
                    color = 'var(--phone-color)';
                    break;
                case 'fa-envelope':
                    color = 'var(--email-color)';
                    break;
                case 'fa-envelope-open':
                    color = 'var(--alt-email-color)';
                    break;
                default:
                    color = 'rgba(59, 130, 246, 0.4)';
            }

            item.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(30, 41, 59, 0.5)';
                this.style.borderColor = color;
                this.querySelector('.contact-icon').style.background = color;
            });

            item.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(30, 41, 59, 0.3)';
                this.style.borderColor = 'rgba(59, 130, 246, 0.1)';
                this.querySelector('.contact-icon').style.background = 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
            });
        });

        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                const platform = this.getAttribute('data-platform');
                this.style.background = 'rgba(30, 41, 59, 0.6)';
                this.style.borderColor = `var(--${platform}-color, rgba(59, 130, 246, 0.4))`;
            });

            link.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(30, 41, 59, 0.3)';
                this.style.borderColor = 'rgba(59, 130, 246, 0.1)';
            });
        });
    }
});