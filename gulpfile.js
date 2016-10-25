const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

gulp.task('js', () => {
   gulp.src('./src/**/*.js')
       .pipe(concat('scripts.js'))
       .pipe(gulp.dest('./build/'))
       .pipe(rename({suffix: '.min'}))
       .pipe(uglify())
       .pipe(gulp.dest('./build/'))
});

gulp.task('watchers', function() {
    gulp.watch('src/**/*.js', ['js']);
});

gulp.task('default', ['js', 'watchers']);