document.addEventListener('DOMContentLoaded', function() {
    initializeImageSlider();
    initializeContactButtons();
    initializeBackButtonFunctionality();
});

function initializeImageSlider() {
    const images = document.querySelectorAll('.product-image');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoSlideInterval;
    const autoSlideDelay = 10000; 

    if (images.length === 0 || dots.length === 0) return;

    function showSlide(index) {

        images.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        images[index].classList.add('active');
        dots[index].classList.add('active');

        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % images.length;
        showSlide(nextIndex);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    function restartAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            restartAutoSlide(); 
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            const prevIndex = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
            showSlide(prevIndex);
            restartAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            restartAutoSlide();
        }
    });

    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', stopAutoSlide);
        galleryContainer.addEventListener('mouseleave', startAutoSlide);
    }

    let touchStartX = 0;
    let touchEndX = 0;

    const imageSlider = document.querySelector('.image-slider');
    if (imageSlider) {
        imageSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        imageSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50; 
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {

                const prevIndex = currentSlide === 0 ? images.length - 1 : currentSlide - 1;
                showSlide(prevIndex);
            } else {

                nextSlide();
            }
            restartAutoSlide();
        }
    }

    showSlide(0);
    startAutoSlide();

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
}

function initializeContactButtons() {

}

function initializeBackButtonFunctionality() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('back-button') || e.target.closest('.back-button')) {
            e.preventDefault();

            const button = e.target.classList.contains('back-button') ? e.target : e.target.closest('.back-button');
            const originalText = button.innerHTML;

            button.innerHTML = button.innerHTML.replace('Back to Products', 'Going back...');
            button.style.opacity = '0.7';

            window.scrollTo({ top: 0, behavior: 'smooth' });

            setTimeout(() => {
                window.location.href = '../products';
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