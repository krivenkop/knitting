'use strict';

var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var del = require('del');

gulp.task('html-dist', function() {
  return gulp
    .src('src/*.html')
    .pipe(gp.html())
    .pipe(gulp.dest('dist/'));
});

// =============================================================
// = DEV TASKS Start                                           =
// =============================================================

// *
// *
// *
// *
//  *************************************************************
//  * HTML task(dev): connect browserSync to html files         *
//  *************************************************************
gulp.task('html', function() {
  return gulp.src('src/*.html').on('end', browserSync.reload);
});

// *
// *
// *
// *
//  *************************************************************
//  * SASS task(dev): Compile SASS to CSS                       *
//  *                 Minificate CSS                            *
//  *                 Add prefixes to CSS attributes            *
//  *                 Add sourcemap                             *
//  *                 connect browserSync                       *
//  *************************************************************
gulp.task('sass', function() {
  return gulp
    .src('src/sass/main.sass')
    .pipe(gp.sourcemaps.init())
    .pipe(gp.sass())
    .pipe(
      gp.autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false,
      })
    )
    .on(
      'error',
      gp.notify.onError({
        title: 'Error running SASS',
      })
    )
    .pipe(gp.csso())
    .pipe(gp.sourcemaps.write())
    .pipe(gulp.dest('src/css'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

//  *************************************************************
//  * COMMON task(dev): Minify common.js                        *
//  *************************************************************
gulp.task('common', function() {
  return gulp
    .src(['src/js/common.js'])
    .pipe(gp.concat('common.min.js'))
    .pipe(gp.uglify())
    .pipe(gulp.dest('src/js'))
    .on('end', browserSync.reload);
});

//  *************************************************************
//  * SCRIPT task(dev): Minify all scripts in one file          *
//  *************************************************************
gulp.task('scripts', function() {
  return gulp
    .src(['src/libs/jquery/jquery.min.js'])
    .pipe(gp.concat('scripts.min.js'))
    .pipe(gp.uglify())
    .pipe(gulp.dest('src/js'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// *
// *
// *
// *
//  *************************************************************
//  * WATCH task(dev): Enable watch to all CSS and HTML         *
//  *************************************************************
gulp.task('watch', function() {
  gulp.watch('src/sass/**/*.sass', gulp.series('sass'));
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/js/common.js', gulp.series('common'));
});

// *
// *
// *
// *
//  *************************************************************
//  * SERVE task(dev): Enable browserSync                       *
//  *                  Connect browserSync to libs directory    *
//  *                  Connect browserSync to assets directory  *
//  *************************************************************

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './src',
    },
  });
  browserSync.watch(['src/libs', 'src/assets'], browserSync.reload);
});

// *
// *
// *
// *
//  *************************************************************
//  * DEFAULT task: Include other dev tasks                     *
//  *               starts by command "gulp"                    *
//  *************************************************************

gulp.task(
  'default',
  gulp.series('sass', 'scripts', 'common', gulp.parallel('watch', 'serve'))
);

// =============================================================
// = DEV TASKS END                                             =
// =============================================================

// =============================================================
// = DIST TASKS START                                          =
// =============================================================

gulp.task('buildJS', function() {
  return gulp
    .src(['src/js/scripts.min.js', 'src/js/common.min.js'])
    .pipe(gulp.dest('dist/js'));
});

gulp.task('buildCSS', function() {
  return gulp.src(['src/css/main.css']).pipe(gulp.dest('dist/css'));
});

gulp.task('buildHTML', function() {
  return gulp.src(['src/*.html']).pipe(gulp.dest('dist'));
});

gulp.task('imagemin', function() {
  return gulp
    .src('src/assets/img/**/*')
    .pipe(gp.cache(gp.imagemin()))
    .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('removedist', function() {
  return gulp.src('dist', { read: false, allowEmpty: true }).pipe(gp.clean());
});

gulp.task('clearcache', function() {
  return gp.cache.clearAll();
});

gulp.task(
  'build',
  gulp.series(
    'removedist',
    'imagemin',
    'sass',
    'common',
    'scripts',
    'buildHTML',
    'buildCSS',
    'buildJS'
  )
);

// =============================================================
// = DIST TASKS END                                            =
// =============================================================
