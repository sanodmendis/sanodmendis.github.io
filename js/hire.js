document.addEventListener('DOMContentLoaded', function() {

    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {

        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translateY(-2px) translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) translate(0, 0)';
        });

        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px) scale(0.98)';
        });

        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
        });

        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    const profileImage = document.querySelector('.profile-image');

    profileImage.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotateY(10deg)';
        this.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    profileImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotateY(0deg)';
    });

    const hireCard = document.querySelector('.hire-card');

    hireCard.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    hireCard.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';

        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 3000 + 2000;

        particle.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: ${startY}px;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.6;
        `;

        document.body.appendChild(particle);

        particle.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 0.6 },
            { transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'linear'
        }).addEventListener('finish', () => {
            particle.remove();
        });
    }

    setInterval(createParticle, 2000);

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = Math.min(scrollProgress, 100) + '%';
    });

    document.addEventListener('keydown', function(e) {

        if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.altKey) {
            document.querySelector('[data-platform="linkedin"]').click();
        }

        if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.altKey) {
            document.querySelector('[data-platform="fiverr"]').click();
        }

        if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.altKey) {
            document.querySelector('[data-platform="download"]').click();
        }
    });

    let ticking = false;

    function updateAnimations() {

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    });

    buttons.forEach(button => {
        button.addEventListener('focus', function() {
            this.style.outline = '2px solid #3b82f6';
            this.style.outlineOffset = '2px';
        });

        button.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            successDiv.style.transform = 'translateX(100%)';
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    }

    document.querySelector('[data-platform="download"]').addEventListener('click', () => {
        showSuccessMessage('CV download started!');
    });

    document.querySelector('[data-platform="linkedin"]').addEventListener('click', () => {
        showSuccessMessage('Opening LinkedIn profile...');
    });

    document.querySelector('[data-platform="fiverr"]').addEventListener('click', () => {
        showSuccessMessage('Opening Fiverr profile...');
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            from {
                transform: scale(0);
                opacity: 0.6;
            }
            to {
                transform: scale(2);
                opacity: 0;
            }
        }

        .dynamic-particle {
            animation: particleFloat linear;
        }

        @keyframes particleFloat {
            from {
                transform: translateY(0) rotate(0deg);
                opacity: 0.6;
            }
            to {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }

        .btn:focus-visible {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px !important;
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
});