const gulp = require('gulp');

gulp.task('server-tests', function () {
    const mocha = require('gulp-spawn-mocha')
    const path = require('path')
    const fs = require('fs')
    return gulp.src(['test/*.js'], {read:false})
        .pipe(mocha({
            cwd: './src',
            c: true,
            R: 'spec',
            b: true,
            env: {NODE_ENV: 'TEST'}
        }))
})

gulp.task('nodemon-run', ['server-tests'], function() {
    const nodemon = require('gulp-nodemon')
    const path = require('path')

    let lastReload = {files: [], time: Date.now()}

    nodemon({
        script: 'app.js',
        ext: 'js',
        cwd: './src',
        tasks: (files) => {
            let todo = []
            const result = files.reduce((acc, value) => {
                let toAdd = 0
                if (lastReload.files.indexOf(value) !== -1) {
                    toAdd = 1
                }
                return acc + toAdd
            }, 0)

            if (result === lastReload.files.length) {
                const reloadTime = Date.now() - lastReload.time
                if (reloadTime > 2000) {
                    todo.push('server-tests')
                    lastReload.time = Date.now()
                }
            } else {
                todo.push('server-tests')
                lastReload.time = Date.now()
            }

            lastReload.files = files

            return todo
        },
        env: {NODE_ENV: 'DEVELOPMENT'}
    })
})

gulp.task('default', ['nodemon-run'])