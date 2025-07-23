class FyuXeraNavbar {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.mobileMenuOpen = false;
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split("/").pop();
    const pageName = filename.split(".")[0] || "home";

    if (pageName === "index") return "home";
    return pageName.toLowerCase();
  }

  getNavbarHTML() {
    const isHirePage = this.currentPage === "hire";
    const hireButtonClass = isHirePage
      ? "active download-cv-btn disabled"
      : "download-cv-btn";
    const hireButtonAttributes = isHirePage
      ? 'aria-disabled="true" tabindex="-1"'
      : "";

    return `
            <nav class="fyuxera-navbar">
                <div class="nav-container">
                <div class="nav-brand">
                    <img src="assets/images/logo.png" alt="FyuXera Logo" class="brand-logo">
                    <a href="./" class="brand-link">
                        <div class="brand-text-container">
                            <span class="brand-text-small">FyuXera</span>
                            <span class="brand-text-main">Sanod D. Mendis</span>
                        </div>
                    </a>
                </div>

                    <ul class="nav-links" id="navLinks">
<li><a href="./" ${
      this.currentPage === "home" ? 'class="active"' : ""
    }>Home</a></li>
<li><a href="./about" ${
      this.currentPage === "about" ? 'class="active"' : ""
    }>About</a></li>
<li><a href="./portfolio" ${
      this.currentPage === "portfolio" ? 'class="active"' : ""
    }>Portfolio</a></li>
<li><a href="./products" ${
      this.currentPage === "products" ? 'class="active"' : ""
    }>Products & Services</a></li>
<li><a href="./contact" ${
      this.currentPage === "contact" ? 'class="active"' : ""
    }>Contact</a></li>
                    </ul>

                    <div class="nav-right">
                        <a href="./hire" class="${hireButtonClass}" ${hireButtonAttributes}>Hire Me</a>

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
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      navbarContainer.innerHTML = this.getNavbarHTML();
    } else {
      document.body.insertAdjacentHTML("afterbegin", this.getNavbarHTML());
    }

    this.initializeMobileMenu();
    this.addScrollEffect();
    this.addActiveNavHighlight();
    this.initializeHireButton();
  }

  initializeHireButton() {
    const hireButton = document.querySelector(".download-cv-btn");

    if (hireButton && this.currentPage === "hire") {
      hireButton.addEventListener("click", (event) => {
        event.preventDefault();
        return false;
      });
    }
  }

  initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const navLinks = document.getElementById("navLinks");

        if (mobileMenuToggle && navLinks) {

            mobileMenuToggle.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            const links = navLinks.querySelectorAll("a");
            links.forEach((link) => {
                link.addEventListener("click", () => {
                    if (this.mobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                });
            });

            document.addEventListener("click", (event) => {
                if (this.mobileMenuOpen && 
                    !navLinks.contains(event.target) && 
                    !mobileMenuToggle.contains(event.target)) {
                    this.closeMobileMenu();
                }
            });

            navLinks.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        }
    }

  toggleMobileMenu() {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const navLinks = document.getElementById("navLinks");

    if (mobileMenuToggle && navLinks) {
      this.mobileMenuOpen = true;
      mobileMenuToggle.classList.add("active");
      navLinks.classList.add("mobile-active");
    }
  }

  closeMobileMenu() {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const navLinks = document.getElementById("navLinks");

    if (mobileMenuToggle && navLinks) {
      this.mobileMenuOpen = false;
      mobileMenuToggle.classList.remove("active");
      navLinks.classList.remove("mobile-active");
    }
  }

  addScrollEffect() {
    const navbar = document.querySelector(".fyuxera-navbar");

    if (navbar) {
      window.addEventListener("scroll", () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      });
    }
  }

  addActiveNavHighlight() {
    const style = document.createElement("style");
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

            .download-cv-btn.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none;
                background-color: #6b7280;
            }

            .download-cv-btn.disabled:hover {
                background-color: #6b7280;
            }

            @media (max-width: 768px) {
                .fyuxera-navbar .nav-links a.active::after {
                    display: none;
                }

                .fyuxera-navbar .nav-links a.active {
                    background-color: rgba(79, 156, 249, 0.1);
                }
            }
        `;
    document.head.appendChild(style);
  }

  updateActivePage(pageName) {
    this.currentPage = pageName;
    const links = document.querySelectorAll(".fyuxera-navbar .nav-links a");
    const hireButton = document.querySelector(".download-cv-btn");

    links.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      const linkPage = href.split("/").pop().split(".")[0];

      if (
        linkPage === pageName ||
        (pageName === "home" && linkPage === "index")
      ) {
        link.classList.add("active");
      }
    });

    if (hireButton) {
      if (pageName === "hire") {
        hireButton.classList.add("disabled", "active");
        hireButton.setAttribute("aria-disabled", "true");
        hireButton.setAttribute("tabindex", "-1");
        hireButton.addEventListener("click", this.preventHireClick);
      } else {
        hireButton.classList.remove("disabled", "active");
        hireButton.removeAttribute("aria-disabled");
        hireButton.removeAttribute("tabindex");
        hireButton.removeEventListener("click", this.preventHireClick);
      }
    }
  }

  preventHireClick(event) {
    event.preventDefault();
    return false;
  }

  initSectionHighlight(
    sections = ["home", "portfolio", "about", "products", "contact"],
  ) {
    const observerOptions = {
      threshold: 0.6,
      rootMargin: "-20% 0px -35% 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.updateActivePage(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const navbar = new FyuXeraNavbar();
  navbar.init();

  window.fyuXeraNavbar = navbar;
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = FyuXeraNavbar;
}
