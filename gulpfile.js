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
// const inject = require('gulp-inject');
const del = require('del');

const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');


// Cleaning/deleting files no longer being used in docs folder
gulp.task('clean:docs', function() {
  console.log('Removing old files from docs');
  return del.sync('docs');
});

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
    .pipe(gulp.dest('docs/assets/css/main'));
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
    .pipe(gulp.dest('docs/assets/css/fonts'));
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


// Concatenating js files
gulp.task('js', function() {
  return gulp.src([
    './assets/js/index.js',
  ])
    .pipe(rollup({
      plugins: [
        babel({ exclude: 'node_modules/**' }),
        resolve(), commonjs(), uglify(),
      ],
    }, 'umd'))
    // .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('docs/assets/js'));
});

// html injecting
gulp.task('html', function() {
  return gulp.src('./index.html')
    .pipe(gulp.dest('./docs'));
});

// Watches for changes while gulp is running
gulp.task('watch', ['css'], function() {
  gulp.watch(['./assets/js/**/*.js'], ['js']);
  gulp.watch([
    './assets/css/**/*.css'], ['css', 'css-fonts',
    ]);
  gulp.watch(['./assets/images/**/*'], ['images']);
  gulp.watch([
    './assets/**/*.html'], ['html',
    ]);
  console.log('Watching for changes');
});

// gulp.task('default', ['clean:docs', 'font', 'scripts', 'images', 'compile-html', 'resetPages', 'media', 'watch']);
gulp.task('default', [
  'clean:docs', 'css', 'css-fonts', 'js', 'fonts', 'images', 'html', 'watch',
]);
