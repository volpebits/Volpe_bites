/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        
    ],
    darkMode: 'class', // ← Volta para 'class' no v3
    theme: {
        extend: {},
    },
    plugins: [],
}