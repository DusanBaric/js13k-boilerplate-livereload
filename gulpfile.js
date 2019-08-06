const config = require('./config');
const gulp = require('gulp');
const include = require('gulp-include');
const del = require('del');
const concat = require('gulp-concat');
const size = require('gulp-size');
const rename = require("gulp-rename");
const terser = require('gulp-terser');
const zip = require('gulp-zip');
const replace = require('gulp-replace');
const html = require('gulp-file-include');
const livereload = require('gulp-livereload');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const gulpif = require('gulp-if');
const open = require('gulp-open');
const fs = require('fs');
const gulpMinifyCssNames = require('gulp-minify-cssnames');
const htmlmin = require('gulp-htmlmin');

const buildAssets = () => {
  del.sync(['temp/**']);

  return gulp.src('src/assets/**/*')
    .pipe(gulpif(!config.minify_assets, imagemin(config.minify_assets_config)))
    .pipe(size(config.size))
    .pipe(gulp.dest('temp/assets'));
}

const buildCss = (_dev) => () => {
  return gulp.src('src/css/*.css')
    .pipe(concat('style.css'))
    .pipe(gulpif(!_dev, replace(config.regex.strip_dev, '')))
    .pipe(gulpif(!_dev, cleanCSS(config.minify_css)))
    .pipe(size(config.size))
    .pipe(gulp.dest('temp'));
}

const buildJs = (_dev) => () => {
  return gulp.src('src/js/main.js')
    .pipe(include())
    .pipe(gulpif(!_dev, replace(config.regex.strip_dev, '')))
    .pipe(gulpif(!_dev, terser(config.minify_js)))
    .pipe(rename("game.js"))
    .pipe(size(config.size))
    .pipe(gulp.dest('temp'));
}

const buildHtml = (_dev) => () => {
  const style = fs.readFileSync('temp/style.css').toString();

  return gulp.src('src/template.html')
    .pipe(html(config.build_html))
    .pipe(replace(config.regex.copy_style, `<style>${style}$1</style>`))
    .pipe(gulpMinifyCssNames({
      prefix: '__',
      postfix: '_'
    }))
    .pipe(gulpif(!_dev, replace(config.regex.strip_html_dev, '')))
    .pipe(gulpif(!_dev, htmlmin({ collapseWhitespace: true })))
    .pipe(rename("index.html"))
    .pipe(gulp.dest('temp'))
    .pipe(gulpif(_dev, open('temp/index.html')))
    .pipe(livereload({}));
}

const copy = () => {
  del.sync(['build/**']);

  return gulp.src(['temp/**/*', '!temp/style.css'])
    .pipe(size(config.size))
    .pipe(gulp.dest('build'));
}

const clear = (done) => {
  del.sync(['temp']);
  done();
}

const pack = (done) => {
  del.sync(['dist/**']);

  return gulp.src('build/**/*')
    .pipe(zip(`${config.name}.zip`))
    .pipe(size(config.size))
    .pipe(gulp.dest('dist'));
}

gulp.task('build-assets', buildAssets);
gulp.task('build-css', buildCss(false));
gulp.task('build-js', buildJs(false));
gulp.task('build-dev-css', buildCss(true));
gulp.task('build-dev-js', buildJs(true));
gulp.task('build-html', gulp.series(['build-assets', 'build-css', 'build-js'], buildHtml(false)));
gulp.task('build-dev-html', gulp.series(['build-assets', 'build-dev-css', 'build-dev-js'], buildHtml(true)));
gulp.task('copy', gulp.series(['build-html'], copy));
gulp.task('build', gulp.series(['copy'], clear));
gulp.task('pack', gulp.series(['copy'], pack));
gulp.task('build-dist', gulp.series(['pack'], clear));

gulp.task('start-dev', gulp.series(['build-dev-html'], () => {
  livereload.listen(config.livereload);
  gulp.watch('src/**/*', gulp.series(['build-dev-html']));
}));