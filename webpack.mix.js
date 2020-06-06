let mix = require('laravel-mix');

mix.babelConfig({
    presets: [
        '@babel/preset-env'
    ],
    plugins: ['@babel/plugin-proposal-class-properties']
})

mix.js('./whenipress.js', 'dist/whenipress.js')