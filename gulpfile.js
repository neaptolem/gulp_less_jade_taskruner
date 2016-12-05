var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    jade = require('gulp-jade'),
    concat = require('gulp-concat'),
    path = require('path'),
    uglify = require('gulp-uglifyjs');

gulp.task('browser-sync', ['styles', 'scripts', 'jade'], function() {
    browserSync.init({
        server: {
            baseDir: "./app"
        },
        notify: false
    });
});

//compile  less code
gulp.task('styles', function() {
    return gulp.src('./less/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

//compile jade code
gulp.task('jade', function() {
    return gulp.src('jade/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('app'));
});

//add JS library for build
gulp.task('scripts', function() {
    return gulp.src(require('./dependencies.json').js)
        .pipe(concat('libs.js'))
        // .pipe(uglify()) //Minify libs.js
        .pipe(gulp.dest('./app/js/'));
});

//add styles library
gulp.task('styles:libs', function() {
    return gulp.src(require('./dependencies.json').css)
        .pipe(concat('libs.css'))
        .pipe(gulp.dest('./app/css/'));
});

//add fonts
gulp.task('addFonts', function() {
    gulp.src(require('./dependencies.json').fonts)
        .pipe(gulp.dest('./app/fonts'));
});

//watchers
gulp.task('watch', function() {
    gulp.watch('less/**/*.less', ['styles']);
    gulp.watch('jade/*.jade', ['jade']);
    gulp.watch('app/libs/**/*.js', ['scripts']);
    gulp.watch('app/js/*.js').on("change", browserSync.reload);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
