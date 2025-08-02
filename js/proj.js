
    // === CUSTOM CURSOR ===
    const cursor = document.querySelector('.custom-cursor');
    let isMouseActive = false;

    // Track mouse position with no delay
    document.addEventListener('mousemove', (e) => {
      // Update cursor position instantly
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';

      // Update glow effect position instantly
      document.body.style.setProperty('--mouse-x', e.clientX + 'px');
      document.body.style.setProperty('--mouse-y', e.clientY + 'px');

      if (!isMouseActive) {
        document.body.classList.add('mouse-active');
        isMouseActive = true;
      }
    });

    // Hide cursor glow when mouse is inactive
    document.addEventListener('mouseleave', () => {
      document.body.classList.remove('mouse-active');
      isMouseActive = false;
    });

    // Add hover class to cursor when hovering interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-item, input, textarea, select');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });

    // === FILTER PROJECTS BY CATEGORY ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.dataset.category;

        // Filter projects
        projectItems.forEach(project => {
          if (category === 'all' || project.dataset.category.includes(category)) {
            project.style.display = 'flex';
          } else {
            project.style.display = 'none';
          }
        });
      });
    });

    // === SCROLL ANIMATIONS ===
    const fadeElements = document.querySelectorAll('.fade-in');

    function checkScroll() {
      fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
          element.classList.add('visible');
        }
      });
    }

    // Initial check
    checkScroll();

    // Check on scroll
    window.addEventListener('scroll', checkScroll);
  