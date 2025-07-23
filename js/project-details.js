document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializeScrollAnimations();
    initializeImagePreview();
    initializeImageLoadingStates();
    initializeBackButtonFunctionality();
});

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

function initializeScrollAnimations() {
    const sections = document.querySelectorAll('.project-phase, .project-conclusion');

    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            sectionObserver.observe(section);
        });
    }
}

function initializeImagePreview() {
    const images = document.querySelectorAll('.phase-image img, .gallery-item img');

    images.forEach(img => {
        img.addEventListener('click', function() {
            openImagePreview(this.src, this.alt);
        });

        img.style.cursor = 'pointer';

        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

function openImagePreview(src, alt) {

    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
    `;

    const imgContainer = document.createElement('div');
    imgContainer.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close image preview');
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        font-size: 40px;
        cursor: pointer;
        z-index: 1001;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
    `;

    closeBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        this.style.transform = 'scale(1.1)';
    });

    closeBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(0, 0, 0, 0.5)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        this.style.transform = 'scale(1)';
    });

    const spinner = document.createElement('div');
    spinner.style.cssText = `
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid #4f9cf9;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `;

    if (!document.querySelector('#spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    imgContainer.appendChild(spinner);
    imgContainer.appendChild(img);
    modal.appendChild(imgContainer);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);

    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });

    img.addEventListener('load', function() {
        spinner.style.display = 'none';
        img.style.transform = 'scale(1)';
    });

    img.addEventListener('error', function() {
        spinner.style.display = 'none';
        img.style.opacity = '0.5';

    });

    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            document.body.style.overflow = '';
        }, 300);
    }

    modal.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleKeyDown);
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    imgContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function initializeImageLoadingStates() {
    document.querySelectorAll('img').forEach(img => {

        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease, transform 0.3s ease';

        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });

        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            console.warn('Failed to load image:', this.src);

            const errorIndicator = document.createElement('div');
            errorIndicator.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
                padding: 0.5rem;
                border-radius: 4px;
                font-size: 0.8rem;
                pointer-events: none;
            `;
            errorIndicator.textContent = 'Failed to load image';

            if (this.parentElement.style.position !== 'relative') {
                this.parentElement.style.position = 'relative';
            }
            this.parentElement.appendChild(errorIndicator);
        });
    });
}

function initializeBackButtonFunctionality() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('back-button') || e.target.closest('.back-button')) {
            e.preventDefault();

            const button = e.target.classList.contains('back-button') ? e.target : e.target.closest('.back-button');
            const originalText = button.innerHTML;
            button.innerHTML = button.innerHTML.replace('Back to Projects', 'Going back...');
            button.style.opacity = '0.7';

            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                window.location.href = '../projects';
            }, 500);
        }
    });
}

function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #4f9cf9, #8b5cf6);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    const updateProgress = throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, 10);

    window.addEventListener('scroll', updateProgress);
}

document.addEventListener('DOMContentLoaded', function() {
    initializeScrollProgress();
});

document.addEventListener('keydown', function(e) {

    if (document.querySelector('.image-modal')) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {

            e.preventDefault();
        }
    }

    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'Home':
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'End':
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                break;
        }
    }
});

let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {

        } else {

        }
    }
}

function initializeFadeInAnimations() {
    const elements = document.querySelectorAll('.tech-tag, .features-list li');

    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            fadeObserver.observe(element);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeFadeInAnimations, 500);
});

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);

});

if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            if (loadTime > 3000) {
                console.warn('Page load time is slow:', loadTime + 'ms');
            }
        }, 0);
    });
}