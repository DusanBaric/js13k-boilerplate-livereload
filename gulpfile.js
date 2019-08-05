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
const fs = require('fs');

const buildAssets = () => {
  del.sync(['temp/**']);

  return gulp.src('src/assets/**/*')
    .pipe(imagemin(config.minify_assets))
    .pipe(size(config.size))
    .pipe(gulp.dest('temp/assets'));
}

const buildCss = () => {
  return gulp.src('src/css/*.css')
    .pipe(concat('style.css'))
    .pipe(cleanCSS(config.minify_css))
    .pipe(size(config.size))
    .pipe(gulp.dest('temp'));
}

const buildJs = () => {
  return gulp.src('src/js/main.js')
    .pipe(include())
    .pipe(terser(config.minify_js))
    .pipe(rename("game.js"))
    .pipe(size(config.size))
    .pipe(gulp.dest('temp'));
}

const buildHtml = () => {
  const style = fs.readFileSync('temp/style.css').toString();

  return gulp.src('src/template.html')
    .pipe(replace(/<style>([\s\S]*)<\/style>/gi, `<style>${style}$1</style>`))
    .pipe(html(config.minify_html))
    .pipe(rename("index.html"))
    .pipe(gulp.dest('temp'))
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
gulp.task('build-css', buildCss);
gulp.task('build-js', buildJs);
gulp.task('build-html', gulp.series(['build-assets', 'build-css', 'build-js'], buildHtml));
gulp.task('copy', gulp.series(['build-html'], copy));
gulp.task('build', gulp.series(['copy'], clear));
gulp.task('pack', gulp.series(['copy'], pack));
gulp.task('build-dist', gulp.series(['pack'], clear));

gulp.task('start-dev', gulp.series(['build-html'], () => {
  livereload.listen(config.livereload);
  gulp.watch('src/**/*', gulp.series(['build-html']));
}));