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
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        orbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        nodeSpark: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.85)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        rise: 'rise 500ms ease-out both',
        orbit: 'orbit 12s linear infinite',
        nodeSpark: 'nodeSpark 2.4s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
