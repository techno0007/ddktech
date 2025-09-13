module.exports = {
  content: [
    "./pages/*.{html,js}",
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./components/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Deep Space Foundation
        primary: {
          DEFAULT: "#0a0a0f", // deep-space-900
          50: "#f8fafc", // slate-50
          100: "#f1f5f9", // slate-100
          200: "#e2e8f0", // slate-200
          300: "#cbd5e1", // slate-300
          400: "#94a3b8", // slate-400
          500: "#64748b", // slate-500
          600: "#475569", // slate-600
          700: "#334155", // slate-700
          800: "#1e293b", // slate-800
          900: "#0a0a0f", // deep-space-900
        },
        
        // Secondary Colors - Rich Navy
        secondary: {
          DEFAULT: "#1e1b4b", // indigo-900
          50: "#eef2ff", // indigo-50
          100: "#e0e7ff", // indigo-100
          200: "#c7d2fe", // indigo-200
          300: "#a5b4fc", // indigo-300
          400: "#818cf8", // indigo-400
          500: "#6366f1", // indigo-500
          600: "#4f46e5", // indigo-600
          700: "#4338ca", // indigo-700
          800: "#3730a3", // indigo-800
          900: "#1e1b4b", // indigo-900
        },
        
        // Accent Colors - Electric Blue
        accent: {
          DEFAULT: "#00d4ff", // cyan-400
          50: "#ecfeff", // cyan-50
          100: "#cffafe", // cyan-100
          200: "#a5f3fc", // cyan-200
          300: "#67e8f9", // cyan-300
          400: "#00d4ff", // cyan-400
          500: "#06b6d4", // cyan-500
          600: "#0891b2", // cyan-600
          700: "#0e7490", // cyan-700
          800: "#155e75", // cyan-800
          900: "#164e63", // cyan-900
        },
        
        // Background Colors - Subtle Space Variation
        background: {
          DEFAULT: "#0f0f23", // space-900
          50: "#f8fafc", // slate-50
          100: "#f1f5f9", // slate-100
          200: "#e2e8f0", // slate-200
          300: "#cbd5e1", // slate-300
          400: "#94a3b8", // slate-400
          500: "#64748b", // slate-500
          600: "#475569", // slate-600
          700: "#334155", // slate-700
          800: "#1e293b", // slate-800
          900: "#0f0f23", // space-900
        },
        
        // Surface Colors - Glassmorphism Cards
        surface: {
          DEFAULT: "#1a1a2e", // space-800
          50: "#f8fafc", // slate-50
          100: "#f1f5f9", // slate-100
          200: "#e2e8f0", // slate-200
          300: "#cbd5e1", // slate-300
          400: "#94a3b8", // slate-400
          500: "#64748b", // slate-500
          600: "#475569", // slate-600
          700: "#334155", // slate-700
          800: "#1a1a2e", // space-800
          900: "#0f0f23", // space-900
        },
        
        // Text Colors
        text: {
          primary: "#ffffff", // white
          secondary: "#94a3b8", // slate-400
          muted: "#64748b", // slate-500
          inverse: "#0f172a", // slate-900
        },
        
        // Status Colors
        success: {
          DEFAULT: "#10b981", // emerald-500
          50: "#ecfdf5", // emerald-50
          100: "#d1fae5", // emerald-100
          200: "#a7f3d0", // emerald-200
          300: "#6ee7b7", // emerald-300
          400: "#34d399", // emerald-400
          500: "#10b981", // emerald-500
          600: "#059669", // emerald-600
          700: "#047857", // emerald-700
          800: "#065f46", // emerald-800
          900: "#064e3b", // emerald-900
        },
        
        warning: {
          DEFAULT: "#f59e0b", // amber-500
          50: "#fffbeb", // amber-50
          100: "#fef3c7", // amber-100
          200: "#fde68a", // amber-200
          300: "#fcd34d", // amber-300
          400: "#fbbf24", // amber-400
          500: "#f59e0b", // amber-500
          600: "#d97706", // amber-600
          700: "#b45309", // amber-700
          800: "#92400e", // amber-800
          900: "#78350f", // amber-900
        },
        
        error: {
          DEFAULT: "#ef4444", // red-500
          50: "#fef2f2", // red-50
          100: "#fee2e2", // red-100
          200: "#fecaca", // red-200
          300: "#fca5a5", // red-300
          400: "#f87171", // red-400
          500: "#ef4444", // red-500
          600: "#dc2626", // red-600
          700: "#b91c1c", // red-700
          800: "#991b1b", // red-800
          900: "#7f1d1d", // red-900
        },
      },
      
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        cta: ['Montserrat', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      backdropBlur: {
        'glass': '16px',
        'glass-sm': '12px',
      },
      
      boxShadow: {
        'glass': '0 4px 32px rgba(0, 212, 255, 0.1)',
        'glass-lg': '0 8px 40px rgba(0, 212, 255, 0.15)',
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 30px rgba(0, 212, 255, 0.6)',
      },
      
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      transitionDuration: {
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(26, 26, 46, 0.4))',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(26, 26, 46, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
        },
        '.glass-border': {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #00d4ff, #67e8f9)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.transition-smooth': {
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}