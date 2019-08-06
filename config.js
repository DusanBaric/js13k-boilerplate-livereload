const imagemin = require('gulp-imagemin');

module.exports = {
    name: 'Js13K',
    regex: {
        copy_style: /<style>([\s\S]*)<\/style>/gi,
        strip_dev: /\/\*\s*DEV_BEGIN\s*\*\/([\s\S]*)\/\*\s*DEV_END\s*\*\//gi,
        strip_html_dev: /\<\!--\s*DEV_BEGIN\s*--\>([\s\S]*)\<\!--\s*DEV_END\s*--\>/gi,
        minify_classes: /__([\s\S]*)_/gi
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
    minify_assets: true,
    minify_assets_config: [
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