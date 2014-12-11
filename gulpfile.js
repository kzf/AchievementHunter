var gulp = require('gulp');

var sass   = require('gulp-sass'),
		uglify   = require('gulp-uglify'),
		concatSM = require('gulp-concat-sourcemap'),
    concat = require('gulp-concat');

gulp.task('sass', function () {
    gulp.src('style/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./'));
});

gulp.task('concat', function() {
  gulp.src([
  		'scripts/!(main)*.js',
  		'scripts/achievements/*.js',
  		'scripts/main.js'
  	])
    .pipe(concatSM("app.js"))
    //.pipe(uglify())
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['sass', 'concat']);