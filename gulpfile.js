var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('watch', function() {

    var bundler = watchify('./src/index.js');

    bundler.transform('brfs');

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle().pipe(source('bundle.js')).pipe(gulp.dest('./dist'));
    }

    return rebundle();

});
