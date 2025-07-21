document.addEventListener('DOMContentLoaded', function() {
    const cachedElements = {
        hero: document.querySelector('.hero'),
        heroTitle: document.querySelector('.hero-title'),
        heroSubtitle: document.querySelector('.hero-subtitle'),
        heroDescription: document.querySelector('.hero-description'),
        heroCta: document.querySelector('.hero-cta'),
        heroImage: document.querySelector('.hero-image'),
        floatingIcons: document.querySelectorAll('.floating-icon'),
        scrollIndicator: document.querySelector('.scroll-indicator'),
        glassCards: document.querySelectorAll('.glass-card'),
        sections: document.querySelectorAll('section'),
        anchorLinks: document.querySelectorAll('a[href^="#"]')
    };

    let ticking = false;
    let lastScrollTime = 0;
    const scrollThrottle = 33; 
    let frameCount = 0;
    let lastFrameTime = performance.now();

    function requestParallaxUpdate() {
        const now = Date.now();
        if (now - lastScrollTime >= scrollThrottle) {
            lastScrollTime = now;
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
    }

    cachedElements.anchorLinks.forEach(link => {
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

    function updateHeroScrollEffects() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const heroRect = cachedElements.hero?.getBoundingClientRect();
        const heroHeight = cachedElements.hero?.offsetHeight || 0;

        if (!heroRect || heroHeight === 0) return;

        const scrollProgress = Math.min(Math.max(scrolled / (heroHeight * 0.8), 0), 1);

        if (cachedElements.heroTitle) {
            const translateX = scrollProgress * -100;
            const opacity = 1 - (scrollProgress * 0.8);
            const scale = 1 - (scrollProgress * 0.1);
            const blur = scrollProgress * 3;

            cachedElements.heroTitle.style.transform = `translateX(${translateX}px) scale(${scale})`;
            cachedElements.heroTitle.style.opacity = Math.max(opacity, 0.2);
            cachedElements.heroTitle.style.filter = `blur(${blur}px)`;
        }

        if (cachedElements.heroSubtitle) {
            const translateX = scrollProgress * -80;
            const opacity = 1 - (scrollProgress * 0.8);
            cachedElements.heroSubtitle.style.transform = `translateX(${translateX}px)`;
            cachedElements.heroSubtitle.style.opacity = Math.max(opacity, 0.2);
        }

        if (cachedElements.heroDescription) {
            const translateX = scrollProgress * -60;
            const opacity = 1 - (scrollProgress * 0.8);
            cachedElements.heroDescription.style.transform = `translateX(${translateX}px)`;
            cachedElements.heroDescription.style.opacity = Math.max(opacity, 0.2);
        }

        if (cachedElements.heroCta) {
            const opacity = 1 - (scrollProgress * 0.8);
            cachedElements.heroCta.style.opacity = Math.max(opacity, 0.2);
        }

        if (cachedElements.heroImage) {
            const translateX = scrollProgress * 100;
            const opacity = 1 - (scrollProgress * 0.8);
            const scale = 1 - (scrollProgress * 0.05);
            const rotateY = scrollProgress * 15;

            cachedElements.heroImage.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
            cachedElements.heroImage.style.opacity = Math.max(opacity, 0.2);
        }

        if (cachedElements.hero) {
            const backgroundY = scrollProgress * 50;
            const backgroundOpacity = 1 - (scrollProgress * 0.3);
            cachedElements.hero.style.transform = `translateY(${backgroundY}px)`;
            cachedElements.hero.style.opacity = Math.max(backgroundOpacity, 0.7);
        }

        cachedElements.floatingIcons.forEach((icon, index) => {
            if (!isInViewport(icon)) return;

            const speed = 0.5 + (index * 0.2);
            const direction = index % 2 === 0 ? 1 : -1;
            const translateY = scrolled * speed * 0.1;
            const translateX = scrolled * speed * 0.05 * direction;
            const rotate = scrolled * 0.1 * direction;
            const opacity = 1 - (scrollProgress * 0.7);

            icon.style.transform = `translateY(${translateY}px) translateX(${translateX}px) rotate(${rotate}deg)`;
            icon.style.opacity = Math.max(opacity, 0.1);
        });

        if (cachedElements.scrollIndicator) {
            const indicatorOpacity = 1 - (scrollProgress * 2);
            cachedElements.scrollIndicator.style.opacity = Math.max(indicatorOpacity, 0);
        }
    }

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const viewportHeight = window.innerHeight;

        updateHeroScrollEffects();

        cachedElements.glassCards.forEach((card, index) => {
            if (!isInViewport(card)) return;

            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = (cardCenter - viewportCenter) / viewportHeight;
            const parallaxOffset = distance * 20;


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

                if (entry.boundingClientRect.bottom < 0) {
                    if (cachedElements.heroTitle) {
                        cachedElements.heroTitle.style.transform = 'translateX(-100px) scale(0.9)';
                        cachedElements.heroTitle.style.opacity = '0.2';
                        cachedElements.heroTitle.style.filter = 'blur(3px)';
                    }

                    if (cachedElements.heroSubtitle) {
                        cachedElements.heroSubtitle.style.transform = 'translateX(-80px)';
                        cachedElements.heroSubtitle.style.opacity = '0.2';
                    }

                    if (cachedElements.heroDescription) {
                        cachedElements.heroDescription.style.transform = 'translateX(-60px)';
                        cachedElements.heroDescription.style.opacity = '0.2';
                    }

                    if (cachedElements.heroImage) {
                        cachedElements.heroImage.style.transform = 'translateX(100px) scale(0.95) rotateY(20deg)';
                        cachedElements.heroImage.style.opacity = '0.2';
                    }
                }
            }
        });
    }, {
        rootMargin: '50px',
        threshold: [0, 0.1, 0.5, 1]
    });

    if (cachedElements.hero) {
        heroObserver.observe(cachedElements.hero);
    }

    const observerOptions = {
        threshold: [0.1],
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

    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.innerHTML = '<span class="typing-text"></span><span class="cursor">|</span>';


        const typingText = subtitle.querySelector('.typing-text');
        const cursor = subtitle.querySelector('.cursor');


        cursor.style.animation = 'blink 1s infinite';


        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80 + Math.random() * 40);
                setTimeout(typeWriter, 80 + Math.random() * 40); 
                setTimeout(typeWriter, 80 + Math.random() * 40); 
            } else {


                setTimeout(() => {
                    cursor.style.opacity = '0';
                }, 2000);
            }
        }

        setTimeout(typeWriter, 1500);
    }

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

    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach((card, index) => {


        card.addEventListener('mousemove', function(e) {
            if (!isInViewport(card)) return;

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;


            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });


        card.addEventListener('mouseenter', function() {
            cachedElements.glassCards.forEach((otherCard, otherIndex) => {
                if (otherIndex !== index) {
                    otherCard.style.opacity = '0.7';
                    otherCard.style.transform = 'scale(0.98)';
                }
            });
        });


            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
                this.style.borderColor = 'rgba(59, 130, 246, 0.2)';
            });
        });
    }

    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {


        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 2;
        const randomAmplitude = 15 + Math.random() * 10;


        icon.style.animationDelay = randomDelay + 's';
        icon.style.animationDuration = randomDuration + 's';
        icon.style.setProperty('--float-amplitude', randomAmplitude + 'px');
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
        `;
        document.body.appendChild(progressBar);


        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrollProgress + '%';
        }, { passive: true });
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

    const codeEditor = document.querySelector('.code-editor');
    if (codeEditor) {


        const codeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)';
                    entry.target.style.transform = 'translateY(-5px)';
                }
            });
        }, { threshold: 0.3 });


        codeObserver.observe(codeEditor);


        codeEditor.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 25px rgba(59, 130, 246, 0.25)';
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        codeEditor.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)';
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-active');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cachedElements.sections.forEach(section => {
        section.style.transition = 'opacity 1s ease, transform 1s ease';
        sectionObserver.observe(section);
    });

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {

        }, 16); 

        }, 16);
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


        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }


        .cursor {
            color: #3b82f6;
            font-weight: 300;
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

        .hero-active .hero-title,
        .hero-active .hero-subtitle,
        .hero-active .hero-description,
        .hero-active .hero-image {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                        opacity 0.3s ease,
                        filter 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
});