document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Fade In Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in, .glass-card');
    fadeElements.forEach(el => {
        el.classList.add('fade-in'); // Ensure class exists
        observer.observe(el);
    });

    // Smooth scroll for navigation links
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

    // Scroll reveal animation
    const scrollRevealObserverOptions = { // Renamed to avoid conflict
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollRevealObserver = new IntersectionObserver((entries) => { // Renamed to avoid conflict
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, scrollRevealObserverOptions);

    // Observe all sections and cards
    document.querySelectorAll('.section, .glass-card, .detail-card').forEach(el => {
        scrollRevealObserver.observe(el);
    });

    // Dynamic background gradient based on scroll
    let lastScrollY = window.scrollY;
    const body = document.body;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollY / maxScroll;

        // Shift background gradient based on scroll position
        // Joy (yellow) → Sadness (blue) → Anxiety (orange)
        const hue1 = 45 - (scrollPercent * 90); // Yellow to blue range
        const hue2 = 270 - (scrollPercent * 60); // Purple to blue range
        const hue3 = 200 + (scrollPercent * 20); // Blue variations

        body.style.background = `linear-gradient(135deg, 
        hsl(${hue1}, 100%, 95%) 0%, 
        hsl(${hue2}, 50%, 95%) 50%, 
        hsl(${hue3}, 70%, 95%) 100%)`;

        lastScrollY = scrollY;
    });

    // Parallax effect for background spheres
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const spheres = document.querySelectorAll('.sphere');

        spheres.forEach((sphere, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            sphere.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Add hover effect to emotion colors
    document.querySelectorAll('.emotion-color').forEach(color => {
        color.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.3) rotate(10deg)';
        });

        color.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Animate numbers or stats if present
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Log page load
    console.log('🎨 Inside Out Emotion Visualization Project');
    console.log('✨ Powered by color, emotion, and personality');
});
