const imagemin = require('gulp-imagemin');

module.exports = {
    name: 'Js13K',
    regex: {
        copyStyle: /<style>([\s\S]*)<\/style>/gi,
        stripDev: /\/\*\s*DEV_BEGIN\s*\*\/([\s\S]*)\/\*\s*DEV_END\s*\*\//gi,
        stripHtmlDev: /\<\!--\s*DEV_BEGIN\s*--\>([\s\S]*)\<\!--\s*DEV_END\s*--\>/gi,
        minifyClasses: /__([\s\S]*)_/gi
    },
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
    build_html: {
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