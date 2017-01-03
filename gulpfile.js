const gulp = require('gulp');

gulp.task('server-tests', function () {
    const mocha = require('gulp-spawn-mocha')
    const path = require('path')
    const fs = require('fs')
    return gulp.src(['server/test/*.js'], {read:false})
        .pipe(mocha({
            cwd: 'server/src',
            c: true,
            R: 'nyan',
            env: {NODE_ENV: 'TEST'}
        }))
})

gulp.task('nodemon-run', ['server-tests'], function() {
    const nodemon = require('gulp-nodemon')
    const path = require('path')
    const nd = nodemon({
        script: './app.js',
        ext: 'js',
        cwd: './server/src',
        tasks: (files) => {
            // console.log(files)
            return ['server-tests']
        },
        env: {NODE_ENV: 'DEVELOPMENT'}
    })
})

gulp.task('server-run', ['server-tests', 'nodemon-run'])