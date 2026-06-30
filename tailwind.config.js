/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050713',
        obsidian: '#0A0D1D',
        aurora: '#73FBD3',
        signal: '#8B5CF6',
        plasma: '#FF4ECD',
        gold: '#E8C160',
        silver: '#C0C7D8',
        frost: '#DDE7FF'
      },
      boxShadow: {
        glow: '0 0 40px rgba(115, 251, 211, 0.18)',
        panel: '0 24px 90px rgba(0, 0, 0, 0.35)'
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' }
        },
        rise: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'none' }
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        nodeSpark: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' }
        },
        luxPulse: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.95', transform: 'scale(1.04)' }
        },
        brandReveal: {
          '0%': { opacity: '0', transform: 'translateY(18px) scale(0.86)', filter: 'blur(10px)' },
          '55%': { opacity: '1', transform: 'translateY(0) scale(1.04)', filter: 'blur(0)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' }
        },
        titleForge: {
          '0%': { opacity: '0', letterSpacing: '0.28em', transform: 'translateY(18px)', filter: 'blur(12px)' },
          '58%': { opacity: '1', letterSpacing: '0.2em', filter: 'blur(0)' },
          '100%': { opacity: '1', letterSpacing: '0.18em', transform: 'translateY(0)', filter: 'blur(0)' }
        },
        orbitReveal: {
          '0%': { opacity: '0', transform: 'rotate(0deg) scale(0.72)' },
          '35%': { opacity: '1', transform: 'rotate(120deg) scale(1)' },
          '100%': { opacity: '0.75', transform: 'rotate(360deg) scale(1.04)' }
        },
        starDrift: {
          '0%, 100%': { opacity: '0.2', transform: 'translate3d(0, 0, 0) scale(0.8)' },
          '50%': { opacity: '0.9', transform: 'translate3d(8px, -10px, 0) scale(1.2)' }
        },
        storyProgress: {
          from: { transform: 'scaleX(0)', opacity: '0.55' },
          to: { transform: 'scaleX(1)', opacity: '1' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        rise: 'rise 500ms ease-out both',
        orbit: 'orbit 12s linear infinite',
        nodeSpark: 'nodeSpark 2.4s ease-in-out infinite',
        luxPulse: 'luxPulse 3.2s ease-in-out infinite',
        brandReveal: 'brandReveal 1.25s cubic-bezier(0.22, 1, 0.36, 1) both',
        titleForge: 'titleForge 1.35s cubic-bezier(0.22, 1, 0.36, 1) 260ms both',
        orbitReveal: 'orbitReveal 2.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        starDrift: 'starDrift 3.8s ease-in-out infinite',
        storyProgress: 'storyProgress 4.2s cubic-bezier(0.22, 1, 0.36, 1) both'
      }
    }
  },
  plugins: []
};
