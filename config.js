const imagemin = require('gulp-imagemin');

module.exports = {
    name: 'Js13K',
    size: {
        pretty: true,
        showFiles: true,
        showTotal: true
    },
    livereload: {
        start: true
    },
    minify_js: {
        toplevel: true
    },
    minify_css: {
    },
    minify_html: {
        prefix: '@@',
        basepath: '@file'
    },
    minify_assets: [
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
            plugins: [
                { removeViewBox: true },
                { cleanupIDs: false }
            ]
        })
    ]
};