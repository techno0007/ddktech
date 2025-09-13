// Matrix Rain Animation JavaScript - English Only
class MatrixAnimation {
    constructor(container) {
        this.container = container;
        this.columns = [];
        this.englishChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.englishWords = [
            'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class',
            'import', 'export', 'async', 'await', 'try', 'catch', 'finally', 'new', 'this',
            'html', 'css', 'javascript', 'react', 'node', 'api', 'database', 'server', 'client',
            'web', 'app', 'code', 'program', 'software', 'development', 'tech', 'digital',
            'business', 'website', 'mobile', 'responsive', 'design', 'frontend', 'backend',
            'framework', 'library', 'component', 'module', 'package', 'repository', 'git',
            'deploy', 'build', 'compile', 'debug', 'test', 'optimize', 'performance'
        ];
        this.englishSentences = [
            'function createApp()',
            'const user = new User()',
            'if (condition) {',
            'return response.data',
            'class Component {',
            'import React from react',
            'export default App',
            'async function fetchData()',
            'try { await api.call() }',
            'let result = await fetch()',
            'for (let i = 0; i < n; i++)',
            'while (condition) {',
            'this.setState({})',
            'super(props)',
            'extends Component',
            'implements Interface',
            'public static void main',
            'private String name',
            'protected int value',
            'static final String',
            'abstract class Shape',
            'final int count',
            'synchronized method',
            'volatile boolean flag',
            'transient Object obj',
            'native void method',
            'strictfp double calc'
        ];
        this.init();
    }

    init() {
        this.createColumns();
        this.startAnimation();
        
        // Mobile-specific optimizations
        if (window.innerWidth <= 768) {
            // Force immediate start for mobile
            this.columns.forEach(column => {
                column.style.animationPlayState = 'running';
                column.style.animationDelay = '0s';
            });
        }
    }

    createColumns() {
        const containerWidth = this.container.offsetWidth;
        const isMobile = window.innerWidth <= 768;
        const columnWidth = isMobile ? 30 : 25; // Wider columns on mobile
        const numColumns = Math.floor(containerWidth / columnWidth);

        for (let i = 0; i < numColumns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = (i * columnWidth) + 'px';
            
            const speeds = ['slow', 'medium', 'fast'];
            column.classList.add(speeds[Math.floor(Math.random() * speeds.length)]);
            
            // Start immediately with no delay
            column.style.animationDelay = '0s';
            column.style.animationPlayState = 'running';
            
            // Add mobile-specific optimizations
            if (isMobile) {
                column.style.fontSize = '10px';
                column.style.lineHeight = '1.1';
            }
            
            this.container.appendChild(column);
            this.columns.push(column);
        }
    }

    startAnimation() {
        this.columns.forEach((column, index) => {
            this.animateColumn(column, index);
        });
    }

    animateColumn(column, index) {
        const animate = () => {
            const numItems = Math.floor(Math.random() * 12) + 6;
            let columnText = '';
            
            for (let i = 0; i < numItems; i++) {
                const randomType = Math.random();
                
                if (randomType < 0.2) {
                    // Add English sentence
                    const sentence = this.englishSentences[Math.floor(Math.random() * this.englishSentences.length)];
                    columnText += sentence + '<br>';
                } else if (randomType < 0.5) {
                    // Add English word
                    const word = this.englishWords[Math.floor(Math.random() * this.englishWords.length)];
                    columnText += word + '<br>';
                } else {
                    // Add English character
                    const char = this.englishChars[Math.floor(Math.random() * this.englishChars.length)];
                    columnText += char + '<br>';
                }
            }
            
            column.innerHTML = columnText;
            
            // Faster updates for mobile devices
            const isMobile = window.innerWidth <= 768;
            const delay = isMobile ? Math.random() * 50 + 10 : Math.random() * 200 + 50;
            setTimeout(animate, delay);
        };
        
        animate();
    }

    destroy() {
        this.columns.forEach(column => {
            if (column.parentNode) {
                column.parentNode.removeChild(column);
            }
        });
        this.columns = [];
    }
}

// Initialize Matrix Animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        // Remove any existing matrix containers
        const existingContainers = heroSection.querySelectorAll('.matrix-container');
        existingContainers.forEach(container => container.remove());
        
        // Create new matrix container
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-container';
        heroSection.appendChild(matrixContainer);
        
        // Initialize new English-only Matrix animation
        const matrix = new MatrixAnimation(matrixContainer);
        
        window.addEventListener('beforeunload', () => {
            matrix.destroy();
        });
    }
});