document.addEventListener('DOMContentLoaded', function() {

    const elements = {
        hireCard: document.querySelector('.hire-card'),
        buttons: document.querySelectorAll('.btn'),
        progressBar: createProgressBar()
    };

    function createProgressBar() {
        const bar = document.createElement('div');
        bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            z-index: 1000;
            transition: width 0.3s ease;
            will-change: width;
        `;
        document.body.appendChild(bar);
        return bar;
    }

    function handleScroll() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / scrollHeight) * 100;
        elements.progressBar.style.width = Math.min(scrollProgress, 100) + '%';
    }

    function handleButtonClick(e) {
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
            will-change: transform, opacity;
        `;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

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
            transform: translate3d(100%,0,0);
            transition: transform 0.3s ease;
            will-change: transform;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.transform = 'translate3d(0,0,0)';
        }, 100);

        setTimeout(() => {
            successDiv.style.transform = 'translate3d(100%,0,0)';
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    }

    function initEventListeners() {

        elements.buttons.forEach(button => {
            button.addEventListener('click', handleButtonClick);
        });

        window.addEventListener('scroll', handleScroll, { passive: true });

        document.addEventListener('keydown', function(e) {
            if (!e.ctrlKey && !e.altKey) {
                if (e.key.toLowerCase() === 'l') {
                    document.querySelector('[data-platform="linkedin"]').click();
                } else if (e.key.toLowerCase() === 'f') {
                    document.querySelector('[data-platform="fiverr"]').click();
                } else if (e.key.toLowerCase() === 'd') {
                    document.querySelector('[data-platform="download"]').click();
                }
            }
        });

        document.querySelector('[data-platform="download"]').addEventListener('click', () => {
            showSuccessMessage('CV download started!');
        });

        document.querySelector('[data-platform="linkedin"]').addEventListener('click', () => {
            showSuccessMessage('Opening LinkedIn profile...');
        });

        document.querySelector('[data-platform="fiverr"]').addEventListener('click', () => {
            showSuccessMessage('Opening Fiverr profile...');
        });
    }

    function initAnimations() {
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
        `;
        document.head.appendChild(style);
    }

    initEventListeners();
    initAnimations();
});