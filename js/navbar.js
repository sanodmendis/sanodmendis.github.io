class FyuXeraNavbar {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.mobileMenuOpen = false;
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        const pageName = filename.split('.')[0] || 'home';

        if (pageName === 'index') return 'home';
        return pageName.toLowerCase();
    }

    getNavbarHTML() {
        return `
            <nav class="fyuxera-navbar">
                <div class="nav-container">
                    <div class="nav-brand">
                        <img src="assets/images/logo.png" alt="FyuXera Logo" class="brand-logo">
                        <span class="brand-text">FyuXera</span>
                    </div>

                    <ul class="nav-links" id="navLinks">
                        <li><a href="./home.html" ${this.currentPage === 'home' ? 'class="active"' : ''}>Home</a></li>
                        <li><a href="./portfolio.html" ${this.currentPage === 'portfolio' ? 'class="active"' : ''}>Portfolio</a></li>
                        <li><a href="./about.html" ${this.currentPage === 'about' ? 'class="active"' : ''}>About</a></li>
                        <li><a href="./products.html" ${this.currentPage === 'products' ? 'class="active"' : ''}>Products</a></li>
                        <li><a href="./contact.html" ${this.currentPage === 'contact' ? 'class="active"' : ''}>Contact</a></li>
                    </ul>

                    <div class="nav-right">
                        <a href="assets/sanodmendis.pdf" download class="download-cv-btn">Download CV</a>
                        
                        <div class="mobile-menu-toggle" id="mobileMenuToggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    init() {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = this.getNavbarHTML();
        } else {
            document.body.insertAdjacentHTML('afterbegin', this.getNavbarHTML());
        }

        this.initializeMobileMenu();
        this.addScrollEffect();
        this.addActiveNavHighlight();
    }

    initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navLinks = document.getElementById('navLinks');

        if (mobileMenuToggle && navLinks) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            const links = navLinks.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.mobileMenuOpen) {
                        this.toggleMobileMenu();
                    }
                });
            });

            document.addEventListener('click', (event) => {
                if (this.mobileMenuOpen && 
                    !mobileMenuToggle.contains(event.target) && 
                    !navLinks.contains(event.target)) {
                    this.toggleMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navLinks = document.getElementById('navLinks');

        if (mobileMenuToggle && navLinks) {
            this.mobileMenuOpen = !this.mobileMenuOpen;

            if (this.mobileMenuOpen) {
                mobileMenuToggle.classList.add('active');
                navLinks.classList.add('mobile-active');
            } else {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('mobile-active');
            }
        }
    }

    addScrollEffect() {
        const navbar = document.querySelector('.fyuxera-navbar');

        if (navbar) {
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }

    addActiveNavHighlight() {
        const style = document.createElement('style');
        style.textContent = `
            .fyuxera-navbar .nav-links a.active {
                color: #4f9cf9 !important;
                font-weight: 600;
                position: relative;
            }

            .fyuxera-navbar .nav-links a.active::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 20px;
                height: 2px;
                background-color: #4f9cf9;
                border-radius: 1px;
            }
        `;
        document.head.appendChild(style);
    }

    updateActivePage(pageName) {
        this.currentPage = pageName;
        const links = document.querySelectorAll('.fyuxera-navbar .nav-links a');

        links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            const linkPage = href.split('/').pop().split('.')[0];

            if (linkPage === pageName || (pageName === 'home' && linkPage === 'index')) {
                link.classList.add('active');
            }
        });
    }

    initSectionHighlight(sections = ['home', 'portfolio', 'about', 'products', 'contact']) {
        const observerOptions = {
            threshold: 0.6,
            rootMargin: '-20% 0px -35% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActivePage(sectionId);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                observer.observe(element);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const navbar = new FyuXeraNavbar();
    navbar.init();

    window.fyuXeraNavbar = navbar;
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FyuXeraNavbar;
}