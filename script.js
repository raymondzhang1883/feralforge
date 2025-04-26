// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // References to DOM elements
    const scrollHint = document.querySelector('.scroll-hint');
    const miniCart = document.getElementById('miniCart');
    const macroBarElements = document.querySelectorAll('.bar');
    const reviewItems = document.querySelectorAll('.review-item');
    const particleOverlay = document.getElementById('particleOverlay');
    
    // Scroll event handlers
    function handleScroll() {
        // Show mini cart after scrolling down 600px
        if (window.scrollY > 600) {
            miniCart.classList.add('visible');
        } else {
            miniCart.classList.remove('visible');
        }
        
        // Animate macro bars when they come into view
        animateElementsOnScroll();
        
        // Create dust particles on dark sections
        createParticlesOnDarkSections();
    }

    // Scroll to the next section when clicking the scroll hint
    if (scrollHint) {
        scrollHint.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Handle macro bar animations on scroll
    function animateElementsOnScroll() {
        macroBarElements.forEach(bar => {
            if (isElementInViewport(bar) && !bar.classList.contains('animated')) {
                const targetWidth = bar.getAttribute('data-target') + '%';
                bar.style.width = targetWidth;
                bar.classList.add('animated');
            }
        });
    }

    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Create review carousel auto-rotation
    let activeReviewIndex = 0;
    function rotateReviews() {
        reviewItems.forEach(item => item.classList.remove('active'));
        reviewItems[activeReviewIndex].classList.add('active');
        activeReviewIndex = (activeReviewIndex + 1) % reviewItems.length;
    }

    // Rotate reviews every 4 seconds
    setInterval(rotateReviews, 4000);

    // Create dust particles on dark sections
    function createParticlesOnDarkSections() {
        const darkSections = document.querySelectorAll('.dark-theme, #poster1, .parallax');
        
        darkSections.forEach(section => {
            if (isElementInViewport(section) && Math.random() > 0.95) {
                createParticle(section);
            }
        });
    }

    // Create a single particle
    function createParticle(section) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random size between 2px and 5px
        const size = Math.random() * 3 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Position based on section bounds
        const sectionRect = section.getBoundingClientRect();
        const sectionX = sectionRect.left;
        const sectionY = sectionRect.top;
        const sectionWidth = sectionRect.width;
        const sectionHeight = sectionRect.height;

        // Random position within section
        const x = sectionX + Math.random() * sectionWidth;
        const y = sectionY + Math.random() * sectionHeight;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = Math.random() * 0.6 + 0.2;

        // Add particle to overlay
        particleOverlay.appendChild(particle);

        // Animate position slightly
        const xMovement = (Math.random() - 0.5) * 20;
        const yMovement = (Math.random() - 0.5) * 20;
        const duration = Math.random() * 3 + 2;

        particle.style.transition = `transform ${duration}s linear, opacity ${duration}s linear`;
        
        // Start animation after a small delay
        setTimeout(() => {
            particle.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
            particle.style.opacity = '0';
        }, 10);

        // Remove particle after animation completes
        setTimeout(() => {
            particleOverlay.removeChild(particle);
        }, duration * 1000);
    }

    // Hover effect for product images
    const productImages = document.querySelectorAll('.poster-image img');
    productImages.forEach(img => {
        img.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Calculate tilt based on mouse position
            const tiltX = ((mouseY / rect.height) - 0.5) * 10;
            const tiltY = ((mouseX / rect.width) - 0.5) * -10;
            
            // Apply tilt and scale-up effect
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
        });
        
        img.addEventListener('mouseleave', function() {
            // Reset to original position with slight delay
            this.style.transition = 'transform 0.5s ease';
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            
            // Remove transition after it completes
            setTimeout(() => {
                this.style.transition = '';
            }, 500);
        });
    });

    // Parallax effect for background image
    const parallaxSection = document.querySelector('.parallax-bg');
    if (parallaxSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const parallaxRate = scrolled * 0.4;
            parallaxSection.style.transform = `translateY(${parallaxRate}px)`;
        });
    }

    // Interactive buttons
    const cartButtons = document.querySelectorAll('.btn-primary:not(.btn-small), .btn-quick-buy');
    const cartCount = document.querySelectorAll('.cart-count');
    let itemCount = 0;

    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Increment cart count
            itemCount++;
            cartCount.forEach(count => {
                count.textContent = itemCount;
            });
            
            // Add "added" feedback
            this.classList.add('added');
            this.textContent = "Added!";
            
            // Reset button text after a delay
            setTimeout(() => {
                this.classList.remove('added');
                if (this.classList.contains('btn-quick-buy')) {
                    this.textContent = "Add 3-Pack to Cart";
                } else {
                    this.textContent = "Add to Cart";
                }
            }, 1500);
        });
    });

    // Initialize page
    window.addEventListener('scroll', handleScroll);
    
    // Initial call to set visible elements on page load
    handleScroll();
    rotateReviews();

    // Create initial particles
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const darkSections = document.querySelectorAll('.dark-theme, #poster1, .parallax');
            darkSections.forEach(section => {
                if (isElementInViewport(section)) {
                    createParticle(section);
                }
            });
        }, i * 200);
    }
}); 