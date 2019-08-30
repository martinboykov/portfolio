const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const size = require('gulp-size');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const browserSync = require('browser-sync');
const del = require('del');

gulp.task('css', function() {
  return gulp.src([
    './assets/css/vendor/bootstrap.min.css',
    './assets/css/vendor/font-awesome.min.css',
    './assets/css/custom/style.css',
    './assets/css/custom/responsive.css',
  ])
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(size({ title: 'styles.css' }))
    .pipe(cssnano())
    .pipe(size({ title: 'styles.min.css' }))
    .pipe(gulp.dest('dist/assets/css/main'))
    .pipe(browserSync.stream());
});

gulp.task('css-fonts', function() {
  return gulp.src([
    './assets/css/fonts/*',
  ])
    .pipe(autoprefixer('last 2 versions'))
    .pipe(rename('fonts.min.css'))
    .pipe(size({ title: 'fonts.css' }))
    .pipe(cssnano({ discardUnused: false }))
    .pipe(size({ title: 'fonts.min.css' }))
    .pipe(gulp.dest('dist/assets/css/fonts'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  gulp.src('./assets/fonts/bootstrap/*')
    .pipe(gulp.dest('dist/assets/fonts/bootstrap'));
  gulp.src('./assets/fonts/fontawesome/*')
    .pipe(gulp.dest('dist/assets/fonts/fontawesome'));
  gulp.src('./assets/fonts/Roboto/*')
    .pipe(gulp.dest('dist/assets/fonts/Roboto'));
});

gulp.task('images', function() {
  return gulp.src('./assets/images/**')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('./dist/assets/images'))
    .pipe(browserSync.stream());
});


// Concatenating js files
gulp.task('js', function() {
  return gulp.src([
    './assets/js/main/jquery.min.js',
    './assets/js/main/bootstrap.min.js',
    './assets/js/main/zepto.min.js',
    './assets/js/plugins/*.js',
    './assets/js/custom/index.js',
  ])
    .pipe(concat('app.js'))
    .pipe(size({ title: 'js' }))
    // .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename('app.min.js'))
    .pipe(minify())
    .pipe(size({ title: 'js.min' }))
    .pipe(gulp.dest('dist/assets/js/main'))
    .pipe(browserSync.stream());
});

gulp.task('html', ['css', 'css-fonts', 'js'], function() {
  const sources = gulp.src([
    './dist/assets/css/fonts/fonts.min.css',
    './dist/assets/css/main/styles.min.css',
    './dist/assets/js/main/app.min.js',
  ]);
  const target = gulp.src('./index.html');

  target.pipe(inject(sources))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./'));
});

// Cleaning/deleting files no longer being used in dist folder
gulp.task('clean:dist', function() {
  console.log('Removing old files from dist');
  return del.sync('dist');
});

// gulp.task('default', ['clean:dist', 'font', 'scripts', 'images', 'compile-html', 'resetPages', 'media', 'watch']);
gulp.task('default', [
  'clean:dist', 'css', 'css-fonts', 'js', 'html', 'fonts', 'images',
]);
