var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify('./main.js').bundle({
        debug: true
    }).pipe(source('burst.js')).pipe(gulp.dest('./build/'));
});
