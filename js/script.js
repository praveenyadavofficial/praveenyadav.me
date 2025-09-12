document.addEventListener('DOMContentLoaded', () => {

    // === THEME TOGGLE FUNCTIONALITY === //
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    if (themeToggle) {
        const applyTheme = (theme) => {
            if (theme === 'light') {
                body.classList.remove('dark-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                body.classList.add('dark-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        };
        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);
        themeToggle.addEventListener('click', () => {
            const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // === MOUSE GLOW & CUSTOM CURSOR === //
    const cursor = document.querySelector('.custom-cursor');
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        document.body.style.cursor = 'none';
        let rafId = null;
        document.addEventListener('mousemove', (e) => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
                document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
                if (cursor) {
                    cursor.style.left = `${e.clientX}px`;
                    cursor.style.top = `${e.clientY}px`;
                }
                body.classList.add('mouse-active');
                rafId = null;
            });
        });
        document.addEventListener('mouseleave', () => body.classList.remove('mouse-active'));
        const hoverables = 'a, button, .project-item, .experience-item, .blog-item, .project-card, .blog-card, .project-card-link, .blog-card-link';
        document.querySelectorAll(hoverables).forEach(el => {
            el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
        });
    }

    // === PROJECT IMAGE MODAL === //
    const modal = document.getElementById('image-modal');
    if (modal) {
        const modalImg = document.getElementById('modal-image');
        const captionText = document.getElementById('modal-caption');
        const imageContainers = document.querySelectorAll('.project-image');
        const closeBtn = document.querySelector('.modal-close-btn');
        imageContainers.forEach(container => {
            container.addEventListener('click', function(e) {
                if (e.currentTarget.closest('a')) e.preventDefault();
                const img = this.querySelector('img');
                if (img) {
                    modal.style.display = "block";
                    modalImg.src = img.src;
                    captionText.innerHTML = img.alt;
                }
            });
        });
        const closeModal = () => { if(modal) modal.style.display = "none"; };
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    }

    // === UNIVERSAL FADE-IN OBSERVER & PAGE-SPECIFIC TRIGGERS === //
    let typingAnimationTriggered = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger typing animation on index.html
                if (entry.target.id === 'about' && !typingAnimationTriggered && typeof initTypingAnimation === 'function') {
                    initTypingAnimation();
                    typingAnimationTriggered = true;
                }
                // Trigger chart animation on research page
                if (entry.target.id === 'dataInsights' && typeof createCharts === 'function') {
                    createCharts();
                }
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


    // === LANDING PAGE SPECIFIC FEATURES (index.html) === //
    const mainContentSections = document.querySelectorAll('main.main-content section[id]');
    
    // Check if we are on the landing page by looking for its specific sections
    if (mainContentSections.length > 0) {
        
        // 1. Typing Animation
        const initTypingAnimation = () => {
            const aboutContent = document.querySelector('.about-content');
            if (!aboutContent) return;
            const paragraphs = Array.from(aboutContent.querySelectorAll('p'));
            if (paragraphs.length === 0) return;
            const texts = paragraphs.map(p => p.innerHTML);
            paragraphs.forEach(p => p.innerHTML = '');
            let paraIndex = 0, charIndex = 0;
            const type = () => {
                if (paraIndex >= paragraphs.length) {
                    if (paragraphs.length > 0) paragraphs[paragraphs.length - 1].classList.remove('typing-cursor');
                    return;
                }
                const currentPara = paragraphs[paraIndex];
                if (charIndex === 0 && paraIndex > 0) paragraphs[paraIndex - 1].classList.remove('typing-cursor');
                currentPara.classList.add('typing-cursor');
                if (charIndex < texts[paraIndex].length) {
                    currentPara.innerHTML += texts[paraIndex].charAt(charIndex++);
                    setTimeout(type, 20);
                } else {
                    paraIndex++; charIndex = 0;
                    setTimeout(type, 300);
                }
            };
            type();
        };

        // 2. Smooth Scrolling & Active Nav Highlighting
        const navLinks = document.querySelectorAll('.nav-link');
        const updateActiveNav = () => {
            let currentSectionId = '';
            mainContentSections.forEach(section => {
                if (window.scrollY >= section.offsetTop - 150) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', updateActiveNav);
        updateActiveNav(); // Initial check on load

        // 3. Interactive Nav Spotlight
        const navList = document.querySelector('.nav-menu');
        if (navList) {
            navList.addEventListener('mousemove', (e) => {
                const targetLi = e.target.closest('li');
                if (targetLi) navList.style.setProperty('--spotlight-y', `${targetLi.offsetTop}px`);
            });
            navList.addEventListener('mouseleave', () => navList.style.setProperty('--spotlight-y', '-9999px'));
        }

        // 4. Mobile Menu Toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
            });
        }
    }

    // === PROJECTS PAGE SPECIFIC FEATURES (projects.html) === //
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCardLinks = document.querySelectorAll('.project-card-link');
    if (filterButtons.length > 0 && projectCardLinks.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const category = button.dataset.category;
                projectCardLinks.forEach(cardLink => {
                    const projectCard = cardLink.querySelector('.project-card');
                    if (projectCard) {
                        const projectCategory = projectCard.dataset.category || "";
                        cardLink.style.display = (category === 'all' || projectCategory.includes(category)) ? 'block' : 'none';
                    }
                });
            });
        });
    }

    // === BLOG PAGE SPECIFIC FEATURES (blog.html) === //
    const blogContainer = document.getElementById('blogPostsContainer');
    if (blogContainer) {
        const filterLinks = document.querySelectorAll('.blog-filter-link');
        const searchInput = document.getElementById('blogSearchInput');
        const blogPostLinks = blogContainer.querySelectorAll('.blog-card-link');
        const noResultsMessage = document.getElementById('noResultsMessage');
        let currentFilter = 'all';

        const filterAndSearchPosts = () => {
            const searchTerm = searchInput.value.toLowerCase();
            let visibleCount = 0;
            blogPostLinks.forEach(link => {
                const post = link.querySelector('.blog-post-card, .blog-card');
                if (!post) return;
                const category = post.dataset.category;
                const title = post.querySelector('.blog-card-title').textContent.toLowerCase();
                const excerpt = post.querySelector('.blog-card-excerpt').textContent.toLowerCase();
                const matchesFilter = currentFilter === 'all' || category === currentFilter;
                const matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
                if (matchesFilter && matchesSearch) {
                    link.style.display = 'block';
                    visibleCount++;
                } else {
                    link.style.display = 'none';
                }
            });
            if(noResultsMessage) noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
        };

        filterLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                filterLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                currentFilter = link.dataset.filter;
                filterAndSearchPosts();
            });
        });

        if(searchInput) searchInput.addEventListener('input', filterAndSearchPosts);
    }

    // === RESEARCH PAGE SPECIFIC FEATURES (social-media-impact.html) === //
    const dataInsightsSection = document.getElementById('dataInsights');
    let chartsCreated = false;
    function createCharts() {
        if (!dataInsightsSection || chartsCreated) return;
        chartsCreated = true;
        const isDarkMode = document.body.classList.contains('dark-theme');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDarkMode ? '#dddddd' : '#4a4a4a';
        const chartOptions = { maintainAspectRatio: false, responsive: true };
        if (document.getElementById('ruralUrbanChart')) new Chart(document.getElementById('ruralUrbanChart'), { type: 'bar', data: { labels: ['Rural Users', 'Urban Users'], datasets: [{ label: 'Internet Users (in millions)', data: [488, 397], backgroundColor: ['#3b82f6', '#8b5cf6'], borderRadius: 4 }] }, options: { ...chartOptions, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { color: gridColor }, ticks: { color: textColor } }, y: { grid: { display: false }, ticks: { color: textColor } } } } });
        if (document.getElementById('genderGapChart')) new Chart(document.getElementById('genderGapChart'), { type: 'doughnut', data: { labels: ['Males Own Phone', 'Females Own Phone'], datasets: [{ data: [43.7, 19.8], backgroundColor: ['#22c55e', '#f59e0b'], borderColor: isDarkMode ? '#111111' : '#f0f0f0', borderWidth: 4 }] }, options: { ...chartOptions, plugins: { legend: { position: 'bottom', labels: { color: textColor } }, tooltip: { callbacks: { label: (c) => `${c.label}: ${c.raw}%` } } } } });
        if (document.getElementById('platformChart')) new Chart(document.getElementById('platformChart'), { type: 'bar', data: { labels: ['WhatsApp', 'Instagram', 'Facebook'], datasets: [{ label: '% of Internet Users', data: [80.8, 77.9, 67.8], backgroundColor: ['#14b8a6', '#ef4444', '#0ea5e9'], borderRadius: 4, }] }, options: { ...chartOptions, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: textColor } }, y: { grid: { color: gridColor }, ticks: { color: textColor } } } } });
        if (document.getElementById('impactsChart')) new Chart(document.getElementById('impactsChart'), { type: 'pie', data: { labels: ['Addicted to Social Media', 'Learning Negatively Affected', 'Delayed Bedtime'], datasets: [{ data: [57, 52, 68], backgroundColor: ['#f43f5e', '#f97316', '#eab308'], borderColor: isDarkMode ? '#111111' : '#f0f0f0', borderWidth: 4 }] }, options: { ...chartOptions, plugins: { legend: { position: 'bottom', labels: { color: textColor } }, tooltip: { callbacks: { label: (c) => `${c.label}: ${c.raw}%` } } } } });
    }
});

