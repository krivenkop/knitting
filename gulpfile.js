'use strict';

var gulp = require('gulp');
var gp = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();

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

gulp.task('default', gulp.series('sass', gulp.parallel('watch', 'serve')));

// =============================================================
// = DEV TASKS END                                             =
// =============================================================

// =============================================================
// = PROD TASKS START                                          =
// =============================================================
