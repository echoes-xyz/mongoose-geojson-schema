const gulp = require('gulp');
const jshint = require('gulp-jshint');
const mocha = require('gulp-mocha');
const stylish = require('jshint-stylish');

gulp.task('jshint', () => {
    return gulp.src(['Gruntfile.js', 'GeoJSON.js', 'test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('mocha', () => {
    return gulp.src('test/**/*.integration.js', {read: false})
    .pipe(mocha());
})

gulp.task('default', ['jshint', 'mocha']);
