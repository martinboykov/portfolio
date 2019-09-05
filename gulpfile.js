const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
// const uglify = require('gulp-uglify');
const { uglify } = require('rollup-plugin-uglify');
// const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
// const minify = require('gulp-minify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const size = require('gulp-size');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const inject = require('gulp-inject');
const del = require('del');

const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

// ---------------------------------
// common
// ---------------------------------
gulp.task('clean:docs', function() {
  console.log('Removing old files from docs');
  return del.sync('docs');
});

gulp.task('fonts', function() {
  gulp.src('./assets/fonts/bootstrap/*')
    .pipe(gulp.dest('docs/assets/fonts/bootstrap'));
  gulp.src('./assets/fonts/fontawesome/*')
    .pipe(gulp.dest('docs/assets/fonts/fontawesome'));
  gulp.src('./assets/fonts/Roboto/*')
    .pipe(gulp.dest('docs/assets/fonts/Roboto'));
});

gulp.task('images', function() {
  return gulp.src('./assets/images/**')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('./docs/assets/images'));
});

gulp.task('default', [
  'clean:docs', 'css-dev', 'js-dev',
  'fonts', 'images', 'html-dev', 'watch',
]);

gulp.task('prod', [
  'clean:docs', 'css-prod', 'js-prod',
  'fonts', 'images', 'html-prod',
]);


// ---------------------------------
// dev
// ---------------------------------
gulp.task('css-dev', function() {
  gulp.src([
    './assets/css/fonts/*',
  ])
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename('fonts.min.css'))
    .pipe(gulp.dest('docs/assets/css/fonts'));

  gulp.src([
    './assets/css/vendor/bootstrap.css',
    './assets/css/vendor/font-awesome.min.css',
  ])
    .pipe(concat('vendor.min.css'))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('docs/assets/css/vendor'));

  gulp.src([
    './assets/css/custom/style.css',
    './assets/css/custom/responsive.css',
  ])
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('docs/assets/css/custom'));
});

gulp.task('js-dev', function() {
  return gulp.src([
    './assets/js/index.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(rollup({
      plugins: [
        babel({ exclude: 'node_modules/**' }),
        resolve(), commonjs(),
      ],
    }, 'umd'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('docs/assets/js'));
});

gulp.task('html-dev', function() {
  const target = gulp.src('./index.html');
  return target
    // .pipe(inject(sources))
    // .pipe(inject(gulp.src('./docs/assets/css/fonts/**/*.css',
    //   { read: false }), { name: 'fonts' }))
    // .pipe(inject(gulp.src('./docs/assets/css/vendor/**/*.css',
    //   { read: false }), { name: 'vendor' }))
    // .pipe(inject(gulp.src('./docs/assets/css/custom/**/*.css',
    //   { read: false }), { name: 'styles' }))
    // .pipe(inject(gulp.src('./docs/assets/js/**/*.js',
    //   { read: false })))
    .pipe(gulp.dest('./docs'));
});

gulp.task('watch', function() {
  gulp.watch(['./assets/js/**/*.js'], ['js-dev']);
  gulp.watch(['./assets/css/custom/**/*.css'], ['css-dev']);
  gulp.watch(['./assets/images/**/*'], ['images']);
  gulp.watch(['./index.html'], ['html-dev']);
  console.log('Watching for changes');
});
// ---------------------------------
// prod
// ---------------------------------
gulp.task('css-prod', function() {
  gulp.src([
    './assets/css/vendor/bootstrap.css',
    './assets/css/vendor/font-awesome.min.css',
    './assets/css/custom/style.css',
    './assets/css/custom/responsive.css',
  ])
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(size({ title: 'styles.css' }))
    .pipe(cssnano())
    .pipe(size({ title: 'styles.min.css' }))
    .pipe(gulp.dest('docs/assets/css/main'));

  gulp.src([
    './assets/css/fonts/*',
  ])
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename('fonts.min.css'))
    .pipe(size({ title: 'fonts.css' }))
    .pipe(cssnano({ discardUnused: false }))
    .pipe(size({ title: 'fonts.min.css' }))
    .pipe(gulp.dest('docs/assets/css/fonts'));
});

gulp.task('js-prod', function() {
  return gulp.src([
    './assets/js/index.js',
  ])
    .pipe(rollup({
      plugins: [
        babel({ exclude: 'node_modules/**' }),
        resolve(), commonjs(), uglify(),
      ],
    }, 'umd'))
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('docs/assets/js'));
});

gulp.task('html-prod', function() {
  return gulp.src('./index.html')
    .pipe(gulp.dest('./docs'));
});

