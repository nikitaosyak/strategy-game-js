var gulp = require('gulp'),
    hint = require('gulp-jshint'),
    connect = require('gulp-connect'),
    replace = require('gulp-replace'),
    clean = require('gulp-clean'),
    through = require('through2');

gulp.task('connect', function() {
    'use strict'

    connect.server({
        root: 'build/',
        port: '8080',
        livereload: true
    });
});

var htmlDeplist = "";
gulp.task('collect-html-deps', function() {
    'use strict'

    var isWin = /^win/.test(process.platform);
    var d = isWin ? '\\' : '\/';
    var regex = new RegExp('^.*src' + d + '.*\.js', 'i');

    htmlDeplist = "";
    return gulp.src(['src/**/*.js'])
        .pipe(through.obj(function(ch, enc, cb) {
            if (regex.test(ch.path)) {
                var partialPath = ch.path.replace(/^.*src./i, '');
                htmlDeplist += '\n    <script type="text/javascript" src="' + partialPath + '"></script>';    
            }
            cb(null, ch)
        }));
});

gulp.task('clean', function() {
    'use strict'
    return gulp.src('build/', {read: false})
        .pipe(clean());    
});

gulp.task('deploy', ['clean', 'collect-html-deps'], function() {
    'use strict'

    gulp.src(['src/**/*.js', '!src/lib/**/*.js'])
        .pipe(hint())
        .pipe(hint.reporter('default'))
        .pipe(gulp.dest('build/'));

    gulp.src('src/lib/**/*.js').pipe(gulp.dest('build/lib/'))

    gulp.src(['src/index.html'])
        .pipe(replace(/.*<!-- GENERATED DEPS HERE -->.*/m, htmlDeplist))
        .pipe(gulp.dest('build/'));

    gulp.src(['src/**/*']).pipe(connect.reload());
});

gulp.task('build', ['clean', 'collect-html-deps', 'deploy'])

gulp.task('watch', function() {
    'use strict'
    gulp.watch(['src/**/*'], ['build']);
});