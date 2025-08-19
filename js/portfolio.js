document.addEventListener('DOMContentLoaded', function() {

    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', function() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (window.scrollY / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px) scale(0.95)';
        item.style.filter = 'blur(5px)';
        item.style.transition = `
            opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            filter 0.8s ease
        `;
        item.dataset.delay = index * 100;
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0) scale(1)';
                    element.style.filter = 'blur(0)';
                }, element.dataset.delay);
            }
        });
    }, observerOptions);

    portfolioItems.forEach(item => {
        fadeInObserver.observe(item);
    });

    portfolioItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.05;

            this.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#' || this.getAttribute('href').includes('-details')) return;

            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'translateY(-2px)';
            tag.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });

        tag.addEventListener('mouseleave', () => {
            tag.style.transform = 'translateY(0)';
            tag.style.boxShadow = 'none';
        });
    });
});