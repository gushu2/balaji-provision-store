/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#D97706', // Amber 600 (Traditional Saffron/Goldish)
                secondary: '#991B1B', // Red 800 (Maroon for Kumkum/Traditional feel)
                accent: '#F59E0B', // Amber 500
                dark: '#1C1917', // Stone 900
                light: '#FFF7ED', // Orange 50 (Warm background)
                green: {
                    50: '#F0FDF4',
                    600: '#16A34A',
                    700: '#15803D',
                }
            },
            fontFamily: {
                serif: ['Playfair Display', 'Merriweather', 'serif'], // Primary Serif for headings
                sans: ['Inter', 'sans-serif'],
                body: ['Merriweather', 'serif'], // Secondary serif for reading text if needed
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            }
        },
    },
    plugins: [],
}
