const gulp = require('gulp');
const del = require('del');
//const spritesmith = require('gulp.spritesmith');
const htmllint = require('gulp-htmllint');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const spawn = require('child_process').spawn;
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');

function clean() {
  return del(['dist/**']);
}

function htmllintReporter(filepath, issues) {
  if (issues.length > 0) {
    issues.forEach(function (issue) {
      fancyLog(colors.cyan('[gulp-htmllint] ') + colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') + colors.red('(' + issue.code + ') ' + issue.msg));
    });
    process.exitCode = 1;
  }
}

function lint_html_jinja() {
  return gulp.src('src/index.html.jinja')
    .pipe(htmllint({config: '.htmllintrc-jinja.json'}, htmllintReporter));
}

function newline_add() {
  return spawn('bin/newline.sh', ['add']);
}

function newline_remove() {
  return spawn('bin/newline.sh', ['remove']);
}

function lint_html_compiled() {
  return gulp.src('dist/{cz,de,en,es,gr}/index.html')
    .pipe(htmllint({config: '.htmllintrc-compiled.json'}, htmllintReporter));
}

function sprites() {
  var spriteData = gulp.src('src/images/flags/*.png').pipe(spritesmith({
    imgName: 'flags.png',
    cssName: '_flags.scss'
  }));
  return spriteData.pipe(gulp.dest('flags/'));
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
exports.lint_html_jinja = lint_html_jinja
exports.lint_html_compiled = gulp.series(build_html_compile, newline_add, lint_html_compiled, newline_remove)
exports.lint_html = gulp.parallel(lint_html_jinja, exports.lint_html_compiled)
exports.lint = gulp.parallel(exports.lint_html)
exports.build_html = gulp.series(build_html_compile, build_html_minify)
exports.build_css = build_css
exports.build_js = build_js
exports.build_dev = gulp.parallel(exports.build_html, build_css, build_js, build_others_dev)
exports.build_prod = gulp.series(gulp.parallel(build_html_minify, build_css, build_js), build_others_prod)
exports.build = exports.build_prod
