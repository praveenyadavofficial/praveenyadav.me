// === MOUSE GLOW EFFECT === //
        let mouseX = 0;
        let mouseY = 0;
        let isMouseActive = false;

        // Update mouse position and glow effect
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Update CSS custom properties for the glow effect
            document.documentElement.style.setProperty('--mouse-x', mouseX + 'px');
            document.documentElement.style.setProperty('--mouse-y', mouseY + 'px');

            // Activate the glow effect
            if (!isMouseActive) {
                document.body.classList.add('mouse-active');
                isMouseActive = true;
            }

            // Update custom cursor position
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.style.left = mouseX + 'px';
                cursor.style.top = mouseY + 'px';
            }
        });

        // Hide glow when mouse leaves window
        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('mouse-active');
            isMouseActive = false;
        });

        // Show glow when mouse enters window
        document.addEventListener('mouseenter', () => {
            document.body.classList.add('mouse-active');
            isMouseActive = true;
        });

        // === CUSTOM CURSOR INTERACTIONS === //
        const cursor = document.querySelector('.custom-cursor');
        const hoverableElements = document.querySelectorAll('a, button, .project-item, .experience-item');

        hoverableElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });

            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });

        // === ORIGINAL JAVASCRIPT FUNCTIONALITY === //

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const sidebar = document.querySelector('.sidebar');
        const navMenu = document.querySelector('.nav-menu');

        mobileToggle.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function updateActiveNav() {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        }

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Scroll event listeners
        window.addEventListener('scroll', updateActiveNav);

        // Initialize on load
        window.addEventListener('load', updateActiveNav);

        // Enhanced hover effects for project and experience items
        const hoverItems = document.querySelectorAll('.project-item, .experience-item');

        hoverItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-2px)';
            });

            item.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0)';
            });
        });

        // Resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.style.display = '';
            }
        });

        // === PERFORMANCE OPTIMIZATION === //
        // Throttle mouse move events for better performance
        let rafId = null;
        document.addEventListener('mousemove', (e) => {
            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                mouseX = e.clientX;
                mouseY = e.clientY;

                // Update CSS custom properties for the glow effect
                document.documentElement.style.setProperty('--mouse-x', mouseX + 'px');
                document.documentElement.style.setProperty('--mouse-y', mouseY + 'px');

                // Update custom cursor position
                const cursor = document.querySelector('.custom-cursor');
                if (cursor) {
                    cursor.style.left = mouseX + 'px';
                    cursor.style.top = mouseY + 'px';
                }

                rafId = null;
            });
        });
        // === ADDITIONAL ENHANCEMENTS === //

        // Add click effect to custom cursor
        document.addEventListener('mousedown', () => {
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.classList.add('click');
            }
        });

        document.addEventListener('mouseup', () => {
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.classList.remove('click');
            }
        });

        // Preload hover states for smoother interactions
        function preloadHoverStates() {
            const hoverElements = document.querySelectorAll('a, button, .project-item, .experience-item');
            hoverElements.forEach(el => {
                el.style.transform = 'translateZ(0)';
            });
        }

        // Initialize everything when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            preloadHoverStates();
            updateActiveNav();

            // Initialize custom cursor if enabled
            if (window.innerWidth > 768) {
                document.body.style.cursor = 'none';
                const cursor = document.querySelector('.custom-cursor');
                if (cursor) {
                    cursor.style.display = 'block';
                }
            }
        });

        // Handle page transitions for a smoother experience
        window.addEventListener('beforeunload', () => {
            document.body.classList.add('page-transition-out');
        });

        // === ACCESSIBILITY IMPROVEMENTS === //
        // Ensure keyboard navigation works with custom cursor
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.style.cursor = 'default';
                const cursor = document.querySelector('.custom-cursor');
                if (cursor) {
                    cursor.style.display = 'none';
                }
            }
        });

        // Restore custom cursor when mouse moves again
        document.addEventListener('mousemove', () => {
            if (window.innerWidth > 768) {
                document.body.style.cursor = 'none';
                const cursor = document.querySelector('.custom-cursor');
                if (cursor) {
                    cursor.style.display = 'block';
                }
            }
        });

        // === TOUCH DEVICE DETECTION === //
        function isTouchDevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints;
        }

        // Disable custom cursor on touch devices
        if (isTouchDevice()) {
            document.body.style.cursor = 'default';
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                cursor.style.display = 'none';
            }
        }