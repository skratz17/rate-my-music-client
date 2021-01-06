const tailwindcss = require('tailwindcss');

module.exports = {
    plugins: [
        tailwindcss('./tailwind.cjs'),
        require('autoprefixer')
    ],
};
