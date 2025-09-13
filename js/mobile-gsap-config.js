// Mobile GSAP Configuration
class MobileGSAPConfig {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }

    init() {
        if (typeof gsap !== 'undefined') {
            this.setupGSAP();
            this.optimizeForMobile();
        }
    }

    setupGSAP() {
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Set default settings for better mobile performance
        gsap.defaults({
            ease: "power2.out",
            duration: 0.6
        });
    }

    optimizeForMobile() {
        if (this.isMobile) {
            // Reduce animation complexity on mobile
            gsap.config({
                force3D: false,
                nullTargetWarn: false
            });
        }
    }

    // Method to optimize section animations
    optimizeSectionAnimations() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            if (this.isMobile) {
                // Simple fade-in for mobile
                gsap.set(section, { opacity: 0, y: 20 });
                gsap.to(section, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                });
            } else {
                // More complex animations for desktop
                gsap.set(section, { opacity: 1, y: 0 });
            }
        });
    }

    // Method to ensure content visibility
    ensureContentVisibility() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            gsap.set(section, { 
                opacity: 1, 
                visibility: 'visible',
                display: 'block'
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileGSAPConfig();
});
