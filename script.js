document.addEventListener('DOMContentLoaded', () => {
    // 3D Tablet Tilt Effect
    const tablet = document.getElementById('tablet');
    const heroVisual = document.querySelector('.hero-visual');

    heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        tablet.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
        tablet.style.transform = `rotateX(0deg) rotateY(0deg)`;
    });

    // Intersection Observer for Reveal Animations
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

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Stagger Card Reveals
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Subtle Parallax on Glow
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const radial = document.querySelector('.radial-top');
        radial.style.transform = `translateX(-50%) translateY(${scrolled * 0.2}px)`;
    });

    // Form Interactions
    const form = document.querySelector('.modern-form');
    form.addEventListener('submit', () => {
        const btn = document.querySelector('.btn-submit');
        btn.innerHTML = "Sending...";
        btn.style.opacity = "0.7";
    });
});
