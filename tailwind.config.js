/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#1e1b4b',
                },
            },
            fontFamily: {
                outfit: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
                inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
    safelist: [
        {
            pattern: /(bg|text|border|decoration|from|to)-(blue|purple|rose|amber|green|indigo)-(50|100|200|400|500|600|700|800)/,
            variants: ['hover', 'group-hover'],
        },
    ],
}
