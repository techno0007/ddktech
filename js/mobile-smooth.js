// Ultra Smooth Mobile Animations and Scrolling
class MobileSmoothAnimations {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isDesktop = window.innerWidth > 768;
        this.scrollPosition = 0;
        this.isScrolling = false;
        this.animationElements = [];
        this.init();
    }

    init() {
        // Setup for both mobile and desktop
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupTouchOptimizations();
        this.setupMobileButtons();
        this.setupMobileCards();
        this.setupScrollToTop();
        this.setupParallaxEffects();
        this.setupScrollOptimizations();
        
        // Desktop-specific optimizations
        if (this.isDesktop) {
            this.setupDesktopOptimizations();
        }
        
        // Listen for resize events
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            this.isDesktop = window.innerWidth > 768;
            this.init();
        });
    }

    setupSmoothScrolling() {
        // Add smooth scrolling to all links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            });
        });

        // Add scroll snap behavior
        document.body.style.scrollSnapType = 'y proximity';
        document.querySelectorAll('section').forEach(section => {
            section.style.scrollSnapAlign = 'start';
            section.style.scrollSnapStop = 'always';
        });
    }

    smoothScrollTo(element) {
        const startPosition = window.pageYOffset;
        const targetPosition = element.offsetTop - 60; // Account for fixed header
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function for smooth animation
            const ease = this.easeInOutCubic(progress);
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with mobile animation classes
        document.querySelectorAll('.mobile-reveal, .mobile-text-reveal, .mobile-stagger').forEach(el => {
            observer.observe(el);
        });

        // Add mobile stagger animation to grid items
        document.querySelectorAll('.grid > *, .flex > *').forEach((el, index) => {
            if (el.closest('section')) {
                el.classList.add('mobile-stagger');
                el.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }

    animateElement(element) {
        if (element.classList.contains('mobile-reveal')) {
            element.classList.add('revealed');
        } else if (element.classList.contains('mobile-text-reveal')) {
            element.classList.add('visible');
        } else if (element.classList.contains('mobile-stagger')) {
            element.classList.add('visible');
        }
    }

    setupTouchOptimizations() {
        // Disable text selection on interactive elements
        document.querySelectorAll('button, .mobile-btn, .mobile-card').forEach(el => {
            el.style.webkitUserSelect = 'none';
            el.style.userSelect = 'none';
            el.style.webkitTouchCallout = 'none';
        });

        // Add touch feedback
        document.querySelectorAll('button, .mobile-btn').forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }

    setupMobileButtons() {
        document.querySelectorAll('button, .mobile-btn').forEach(button => {
            button.classList.add('mobile-btn');
            
            // Add ripple effect
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    setupMobileCards() {
        document.querySelectorAll('.glass, .card, [class*="card"]').forEach(card => {
            card.classList.add('mobile-card');
            
            // Disable expensive effects on mobile
            if (this.isMobile) {
                card.style.transition = 'none';
                card.style.transform = 'none';
                card.style.boxShadow = 'none';
                card.style.backdropFilter = 'none';
                card.style.webkitBackdropFilter = 'none';
            } else {
                // Add hover effect for desktop only
                card.addEventListener('touchstart', () => {
                    card.style.transform = 'translateY(-2px) translateZ(0)';
                    card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                });
                
                card.addEventListener('touchend', () => {
                    card.style.transform = 'translateY(0) translateZ(0)';
                    card.style.boxShadow = '';
                });
            }
        });
    }

    setupScrollToTop() {
        // Create scroll to top button
        const scrollTopBtn = document.createElement('a');
        scrollTopBtn.href = '#';
        scrollTopBtn.className = 'mobile-scroll-top';
        scrollTopBtn.innerHTML = '↑';
        scrollTopBtn.style.display = 'none';
        document.body.appendChild(scrollTopBtn);

        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        // Smooth scroll to top
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.smoothScrollTo(document.body);
        });
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.mobile-parallax');
        
        window.addEventListener('scroll', () => {
            if (this.isScrolling) return;
            
            this.isScrolling = true;
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = element.dataset.speed || 0.5;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px) translateZ(0)`;
                });
                
                this.isScrolling = false;
            });
        });
    }

    setupScrollOptimizations() {
        // Throttle scroll events for better performance
        let scrollTimeout;
        let isScrolling = false;
        
        const handleScroll = () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    // Disable heavy animations during scroll
                    document.body.classList.add('scrolling');
                    isScrolling = false;
                });
                isScrolling = true;
            }
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('scrolling');
            }, 150);
        };
        
        // Use passive listeners for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Optimize touch events
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            const touchDiff = touchStartY - touchEndY;
            
            // Add momentum scrolling for better feel
            if (Math.abs(touchDiff) > 50) {
                document.body.style.scrollBehavior = 'smooth';
                setTimeout(() => {
                    document.body.style.scrollBehavior = 'auto';
                }, 1000);
            }
        }, { passive: true });
        
        // Disable heavy animations during scroll
        const style = document.createElement('style');
        style.textContent = `
            .scrolling * {
                animation-play-state: paused !important;
                transition: none !important;
            }
            .scrolling .mobile-parallax {
                transform: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Utility method to add mobile animations to any element
    addMobileAnimation(element, animationType = 'reveal') {
        if (!this.isMobile) return;
        
        element.classList.add(`mobile-${animationType}`);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(element);
    }

    setupDesktopOptimizations() {
        // Desktop-specific smooth animations
        this.setupDesktopHoverEffects();
        this.setupDesktopScrollAnimations();
        this.setupDesktopPerformanceOptimizations();
    }

    setupDesktopHoverEffects() {
        // Enhanced hover effects for desktop
        const cards = document.querySelectorAll('.glass, .card, [class*="card"], .journey-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.willChange = 'transform, box-shadow';
                card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.willChange = 'auto';
            });
        });
    }

    setupDesktopScrollAnimations() {
        // Desktop-specific scroll animations with higher frame rates
        const elements = document.querySelectorAll('section, .hero-content, .futuristic-description');
        
        elements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            element.style.backfaceVisibility = 'hidden';
            element.style.perspective = '1000px';
        });
    }

    setupDesktopPerformanceOptimizations() {
        // Desktop performance optimizations
        document.body.style.webkitFontSmoothing = 'antialiased';
        document.body.style.mozOsxFontSmoothing = 'grayscale';
        
        // Enable hardware acceleration for all animated elements
        const animatedElements = document.querySelectorAll('*');
        animatedElements.forEach(element => {
            element.style.webkitTransform = 'translateZ(0)';
            element.style.transform = 'translateZ(0)';
        });
    }
}

// Add CSS for ripple effect
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize mobile smooth animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileSmoothAnimations();
});

// Export for use in other scripts
window.MobileSmoothAnimations = MobileSmoothAnimations;