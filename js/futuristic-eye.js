// Futuristic Computer Supervision Eye
class FuturisticEye {
    constructor() {
        this.eye = null;
        this.isActive = false;
        this.isScanning = false;
        this.isAlert = false;
        this.progress = 0;
        this.maxProgress = 100;
        this.scanInterval = null;
        this.progressInterval = null;
        this.init();
    }

    init() {
        this.createEyeElement();
        this.setupEventListeners();
        this.startAnimations();
        this.updateProgress();
    }

    createEyeElement() {
        // Look for existing container first
        let eyeContainer = document.querySelector('.futuristic-eye-container');
        
        console.log('Looking for futuristic eye container:', eyeContainer);
        
        if (eyeContainer) {
            // Use existing container and populate it
            this.eye = eyeContainer;
            console.log('Found eye container, creating eye element');
            
            // Create the eye structure inside the existing container
            eyeContainer.innerHTML = `
                <div class="futuristic-eye">
                    <div class="eye-iris">
                        <div class="eye-pupil"></div>
                    </div>
                    
                    <!-- HUD Interface -->
                    <div class="eye-hud">
                        <div class="hud-ring"></div>
                        <div class="progress-indicator" id="progressIndicator">0%</div>
                        <div class="scan-line"></div>
                    </div>
                    
                    <!-- Data Streams -->
                    <div class="data-streams">
                        <div class="data-stream"></div>
                        <div class="data-stream"></div>
                        <div class="data-stream"></div>
                        <div class="data-stream"></div>
                    </div>
                    
                    <!-- Binary Code Overlay -->
                    <div class="binary-overlay">
                        <div class="binary-text">01001000 01100101 01101100 01101100 01101111</div>
                        <div class="binary-text">01110011 01111001 01110011 01110100 01100101 01101101</div>
                        <div class="binary-text">01100001 01100011 01110100 01101001 01110110 01100101</div>
                        <div class="binary-text">01110000 01110010 01101111 01100011 01100101 01110011 01110011</div>
                    </div>
                    
                    <!-- Status Indicators -->
                    <div class="status-indicators">
                        <div class="status-indicator"></div>
                        <div class="status-indicator"></div>
                        <div class="status-indicator"></div>
                    </div>
                    
                    <!-- Compass System -->
                    <div class="compass-ring"></div>
                    <div class="compass-markers">
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                        <div class="compass-marker"></div>
                    </div>
                    <div class="compass-arrow" id="compassArrow"></div>
                    
                    <!-- Neural Network Pattern -->
                    <div class="neural-pattern">
                        <div class="neural-node" style="top: 20%; left: 30%;"></div>
                        <div class="neural-node" style="top: 40%; left: 60%;"></div>
                        <div class="neural-node" style="top: 60%; left: 25%;"></div>
                        <div class="neural-node" style="top: 80%; left: 70%;"></div>
                        <div class="neural-connection" style="top: 25%; left: 35%; width: 25px; transform: rotate(45deg);"></div>
                        <div class="neural-connection" style="top: 45%; left: 45%; width: 20px; transform: rotate(-30deg);"></div>
                        <div class="neural-connection" style="top: 65%; left: 30%; width: 30px; transform: rotate(60deg);"></div>
                    </div>
                </div>
            `;
        } else {
            // If no container exists, create one but don't add to body
            console.warn('No futuristic-eye-container found in HTML. Please add the container div to your HTML.');
            return;
        }
    }

    setupEventListeners() {
        if (!this.eye) {
            console.warn('Futuristic eye not initialized properly');
            return;
        }
        
        // Click to activate/deactivate
        this.eye.addEventListener('click', () => {
            this.toggleActive();
        });

        // Mouse movement tracking
        document.addEventListener('mousemove', (e) => {
            this.trackMouse(e);
        });

        // Touch movement tracking
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                // Create a mouse-like event for touch
                const mouseEvent = {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };
                this.trackMouse(mouseEvent);
            }
        }, { passive: true });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.toggleActive();
            }
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.toggleScanning();
            }
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                this.toggleAlert();
            }
        });

        // Window focus/blur
        window.addEventListener('focus', () => {
            this.setActive(true);
        });

        window.addEventListener('blur', () => {
            this.setActive(false);
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.setActive(false);
            } else {
                this.setActive(true);
            }
        });
    }

    trackMouse(e) {
        if (!this.isActive) return;

        const eyeRect = this.eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;

        // Move pupil to follow mouse
        const pupil = this.eye.querySelector('.eye-pupil');
        const maxMovement = 8;
        const pupilX = Math.max(-maxMovement, Math.min(maxMovement, deltaX * 0.1));
        const pupilY = Math.max(-maxMovement, Math.min(maxMovement, deltaY * 0.1));

        pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;

        // Update compass arrow to point towards mouse
        this.updateCompassArrow(deltaX, deltaY);

        // Add glow effect when looking at cursor
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < 100) {
            pupil.style.boxShadow = '0 0 15px rgba(0, 212, 255, 1), 0 0 30px rgba(0, 212, 255, 0.5)';
        } else {
            pupil.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.8)';
        }
    }

    updateCompassArrow(deltaX, deltaY) {
        const compassArrow = this.eye.querySelector('#compassArrow');
        if (!compassArrow) return;

        // Calculate angle from center to mouse position
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        
        // Rotate compass arrow to point towards mouse
        compassArrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        
        // Add glow effect based on distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < 150) {
            compassArrow.style.filter = 'drop-shadow(0 0 10px rgba(0, 212, 255, 1))';
            compassArrow.style.opacity = '1';
        } else {
            compassArrow.style.filter = 'drop-shadow(0 0 5px rgba(0, 212, 255, 0.6))';
            compassArrow.style.opacity = '0.8';
        }
    }

    toggleActive() {
        this.setActive(!this.isActive);
    }

    setActive(active) {
        this.isActive = active;
        this.eye.classList.toggle('active', active);
        
        if (active) {
            this.startProgress();
            this.showNotification('Eye System Activated', 'System monitoring enabled');
        } else {
            this.stopProgress();
            this.showNotification('Eye System Deactivated', 'System monitoring disabled');
        }
    }

    toggleScanning() {
        this.isScanning = !this.isScanning;
        this.eye.classList.toggle('scanning', this.isScanning);
        
        if (this.isScanning) {
            this.startScanning();
            this.showNotification('Scanning Mode', 'Deep system analysis in progress');
        } else {
            this.stopScanning();
            this.showNotification('Scanning Stopped', 'Analysis complete');
        }
    }

    toggleAlert() {
        this.isAlert = !this.isAlert;
        this.eye.classList.toggle('alert', this.isAlert);
        
        if (this.isAlert) {
            this.showNotification('ALERT MODE', 'Critical system attention required');
            this.startAlertSequence();
        } else {
            this.stopAlertSequence();
            this.showNotification('Alert Cleared', 'System status normal');
        }
    }

    startProgress() {
        this.progress = 0;
        this.progressInterval = setInterval(() => {
            this.progress += Math.random() * 2;
            if (this.progress > this.maxProgress) {
                this.progress = this.maxProgress;
            }
            this.updateProgress();
        }, 100);
    }

    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    updateProgress() {
        const progressElement = this.eye.querySelector('#progressIndicator');
        if (progressElement) {
            const percentage = Math.round(this.progress);
            progressElement.textContent = `${percentage}%`;
            
            // Update progress ring
            const hudRing = this.eye.querySelector('.hud-ring');
            if (hudRing) {
                const angle = (percentage / 100) * 360;
                hudRing.style.background = `conic-gradient(from 0deg, #00d4ff 0deg, #00d4ff ${angle}deg, rgba(0, 212, 255, 0.2) ${angle}deg)`;
            }
        }
    }

    startScanning() {
        this.scanInterval = setInterval(() => {
            // Simulate scanning data
            this.updateBinaryData();
            this.updateNeuralActivity();
        }, 500);
    }

    stopScanning() {
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
    }

    startAlertSequence() {
        const alertInterval = setInterval(() => {
            if (!this.isAlert) {
                clearInterval(alertInterval);
                return;
            }
            
            // Flash effect
            this.eye.style.animation = 'none';
            setTimeout(() => {
                this.eye.style.animation = 'alert-flash 0.5s ease-in-out';
            }, 10);
        }, 1000);
    }

    stopAlertSequence() {
        this.eye.style.animation = '';
    }

    updateBinaryData() {
        const binaryTexts = this.eye.querySelectorAll('.binary-text');
        binaryTexts.forEach(text => {
            const newBinary = this.generateRandomBinary();
            text.textContent = newBinary;
        });
    }

    updateNeuralActivity() {
        const nodes = this.eye.querySelectorAll('.neural-node');
        const connections = this.eye.querySelectorAll('.neural-connection');
        
        // Randomly activate nodes
        nodes.forEach(node => {
            if (Math.random() > 0.7) {
                node.style.opacity = '1';
                node.style.boxShadow = '0 0 5px #00d4ff';
                setTimeout(() => {
                    node.style.opacity = '0.6';
                    node.style.boxShadow = '0 0 3px #00d4ff';
                }, 200);
            }
        });
        
        // Randomly activate connections
        connections.forEach(connection => {
            if (Math.random() > 0.8) {
                connection.style.opacity = '1';
                setTimeout(() => {
                    connection.style.opacity = '0.6';
                }, 300);
            }
        });
    }

    generateRandomBinary() {
        const length = 32;
        let binary = '';
        for (let i = 0; i < length; i++) {
            binary += Math.random() > 0.5 ? '1' : '0';
        }
        return binary;
    }

    startAnimations() {
        // Continuous subtle animations
        setInterval(() => {
            if (this.isActive) {
                this.updateDataStreams();
            }
        }, 2000);
    }

    updateDataStreams() {
        const streams = this.eye.querySelectorAll('.data-stream');
        streams.forEach(stream => {
            stream.style.animation = 'none';
            setTimeout(() => {
                stream.style.animation = 'data-flow 3s linear infinite';
            }, 10);
        });
    }

    showNotification(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid #00d4ff;
            border-radius: 8px;
            padding: 12px 16px;
            color: #00d4ff;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 1001;
            backdrop-filter: blur(10px);
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
            max-width: 300px;
            animation: notification-slide 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
            <div style="opacity: 0.8;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'notification-slide 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public methods for external control
    activate() {
        this.setActive(true);
    }

    deactivate() {
        this.setActive(false);
    }

    scan() {
        this.toggleScanning();
    }

    alert() {
        this.toggleAlert();
    }

    setProgress(percentage) {
        this.progress = Math.max(0, Math.min(100, percentage));
        this.updateProgress();
    }

    destroy() {
        if (this.eye && this.eye.parentNode) {
            this.eye.parentNode.removeChild(this.eye);
        }
        this.stopProgress();
        this.stopScanning();
    }
}

// Test if script is loading
console.log('Futuristic Eye script loaded!');

// Add CSS animations
const eyeStyle = document.createElement('style');
eyeStyle.textContent = `
    @keyframes alert-flash {
        0%, 100% { 
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
        }
        50% { 
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.8), 0 0 60px rgba(255, 0, 0, 0.4);
        }
    }
    
    @keyframes notification-slide {
        0% { 
            transform: translateX(-100%);
            opacity: 0;
        }
        100% { 
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(eyeStyle);

// Initialize the futuristic eye when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== FUTURISTIC EYE INITIALIZATION ===');
    console.log('Initializing Futuristic Eye...');
    console.log('Screen width:', window.innerWidth);
    console.log('Is mobile:', window.innerWidth <= 768);
    
    // Wait a bit to ensure all elements are loaded
    setTimeout(() => {
        const container = document.querySelector('.futuristic-eye-container');
        console.log('Container found:', container);
        console.log('Container computed style:', container ? window.getComputedStyle(container).display : 'N/A');
        
        if (container) {
            console.log('Container innerHTML before:', container.innerHTML);
            
            // Force container to be visible
            container.style.display = 'flex';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
            
            window.futuristicEye = new FuturisticEye();
            console.log('Container innerHTML after:', container.innerHTML);
        } else {
            console.error('Futuristic eye container not found!');
        }
    }, 100);
    
    // Add keyboard shortcut info
    console.log('Futuristic Eye Controls:');
    console.log('Ctrl+E: Toggle Eye System');
    console.log('Ctrl+S: Toggle Scanning Mode');
    console.log('Ctrl+A: Toggle Alert Mode');
    console.log('Click: Toggle Active State');
    
    // Fallback initialization for desktop
    setTimeout(() => {
        if (!window.futuristicEye) {
            console.log('Fallback initialization for desktop...');
            const container = document.querySelector('.futuristic-eye-container');
            if (container && container.innerHTML.trim() === '') {
                console.log('Container is empty, reinitializing...');
                container.style.display = 'flex';
                container.style.visibility = 'visible';
                container.style.opacity = '1';
                window.futuristicEye = new FuturisticEye();
            }
        }
    }, 1000);
    
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FuturisticEye;
}
