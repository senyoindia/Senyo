// Scroll reveal animation observer
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    // Parallax scroll effect
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach((el) => {
            const speed = el.getAttribute('data-parallax');
            let yPos = 0;
            
            switch(speed) {
                case 'slow':
                    yPos = -(scrolled * 0.05);
                    break;
                case 'medium':
                    yPos = -(scrolled * 0.1);
                    break;
                case 'fast':
                    yPos = -(scrolled * 0.15);
                    break;
                default:
                    yPos = 0;
            }
            
            el.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Mouse tracking for cursor glow
    const cursorGlow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', function(e) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // 3D Tablet mouse tilt effect
    const tablet = document.getElementById('tablet3d');
    if (tablet) {
        tablet.addEventListener('mousemove', function(e) {
            const rect = tablet.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            tablet.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });

        tablet.addEventListener('mouseleave', function() {
            tablet.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    }

    // 3D tilt effect for problem cards
    const problemCards = document.querySelectorAll('.problem-card');
    problemCards.forEach((card) => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // 3D tilt effect for solution panels
    const solutionPanels = document.querySelectorAll('.solution-panel');
    solutionPanels.forEach((panel) => {
        panel.addEventListener('mousemove', function(e) {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            panel.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`;
        });

        panel.addEventListener('mouseleave', function() {
            panel.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
        });
    });

    // Create falling shapes
    createFallingShapes();

    // Form submission handling
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function() {
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Scroll to feedback section function
function scrollToFeedback() {
    const feedbackSection = document.getElementById('feedback-section');
    if (feedbackSection) {
        feedbackSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Create falling shapes function
function createFallingShapes() {
    const container = document.getElementById('fallingShapesContainer');
    const shapeTypes = ['circle', 'square', 'triangle', 'diamond', 'hexagon'];
    const animationTypes = ['fall', 'fall-sway', 'fall-zigzag'];
    const numberOfShapes = 25;

    for (let i = 0; i < numberOfShapes; i++) {
        const shape = document.createElement('div');
        shape.classList.add('falling-shape');
        
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.classList.add(shapeType);
        
        const size = Math.random() * 40 + 20;
        if (shapeType !== 'triangle' && shapeType !== 'hexagon') {
            shape.style.width = size + 'px';
            shape.style.height = size + 'px';
        } else if (shapeType === 'triangle') {
            const triangleSize = size / 2;
            shape.style.borderLeftWidth = triangleSize + 'px';
            shape.style.borderRightWidth = triangleSize + 'px';
            shape.style.borderBottomWidth = (triangleSize * 1.75) + 'px';
        }
        
        shape.style.left = Math.random() * 100 + '%';
        
        const animationType = animationTypes[Math.floor(Math.random() * animationTypes.length)];
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 10;
        
        shape.style.animation = `${animationType} ${duration}s linear ${delay}s infinite`;
        
        container.appendChild(shape);
    }
}
