const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');
const del = require('del');
const spawn = require('child_process').spawn;
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');

function sprites() {
  var spriteData = gulp.src('src/images/flags/*.png').pipe(spritesmith({
    imgName: 'flags.png',
    cssName: '_flags.scss'
  }));
  return spriteData.pipe(gulp.dest('flags/'));
}

function clean() {
  return del(['dist/**']);
}

function build_html_compile() {
  return spawn('bin/build_html_compile.py');
}

function build_html_minify() {
  var config = require('./.htmlminrc.json')
  return gulp.src('dist/*/index.html')
    .pipe(htmlmin(config))
    .pipe(gulp.dest('dist'));
}

function build_css() {
  return gulp.src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleancss())
    .pipe(sourcemaps.write('.', {sourceRoot: '../../src/scss'}))
    .pipe(gulp.dest('dist/css'));
}

function build_js() {
  return gulp.src('src/js/script.js')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.identityMap())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.', {sourceRoot: '../../src/js'}))
    .pipe(gulp.dest('dist/js'));
}

function build_others_dev() {
  return gulp.src('src/{fonts,images}')
    .pipe(gulp.symlink('dist'));
}

function build_others_prod() {
  return spawn('bin/build_others_prod.sh');
}

exports.sprites = sprites
exports.clean = clean
exports.build_html = gulp.series(build_html_compile, build_html_minify)
exports.build_css = build_css
exports.build_js = build_js
exports.build_dev = gulp.parallel(exports.build_html, build_css, build_js, build_others_dev)
exports.build_prod = gulp.series(gulp.parallel(exports.build_html, build_css, build_js), build_others_prod)
exports.build = exports.build_prod
