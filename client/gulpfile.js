const gulp = require('gulp')
const connect = require('gulp-connect')

gulp.task('connect', function() {

    connect.server({
        root: 'build/',
        port: '8080',
        livereload: true
    });
});

let htmlDeps = "";
gulp.task('collect-html-deps', function() {
    'use strict'

    // const isWin = /^win/.test(process.platform);
    // const d = isWin ? '\\' : '\/';
    // const regex = new RegExp('^.*src' + d + '.*\.js', 'i');
    const through = require('through2')

    htmlDeps = "";
    return gulp.src(['src/**/*.js'])
        .pipe(through.obj(function(ch, enc, cb) {
            // if (regex.test(ch.path)) {
            const partialPath = ch.path.replace(/^.*src./i, '');
            htmlDeps += '\n    <script type="text/javascript" src="' + partialPath + '"></script>';
            // }
            cb(null, ch)
        }));
});

gulp.task('clean', function() {
    const clean = require('gulp-clean')
    return gulp.src('build/', {read: false}).pipe(clean());
});

gulp.task('deploy-raw', ['clean', 'collect-html-deps'], function() {
    const replace = require('gulp-replace')

    gulp.src(['src/**/*.js', '!src/lib/**/*.js'])
        .pipe(gulp.dest('build/'));

    gulp.src('src/lib/**/*.js').pipe(gulp.dest('build/lib/'))

    gulp.src(['src/index.html'])
        .pipe(replace(/.*<!-- GENERATED DEPS HERE -->.*/m, htmlDeps))
        .pipe(gulp.dest('build/'));

    gulp.src(['src/**/*']).pipe(connect.reload());
});

gulp.task('watch', function() {
    'use strict'
    gulp.watch(['src/**/*'], ['deploy-raw']);
});

gulp.task('default', ['connect', 'deploy-raw', 'watch'])