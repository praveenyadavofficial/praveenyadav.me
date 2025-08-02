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
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });