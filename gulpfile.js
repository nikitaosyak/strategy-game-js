const   gulp = require('gulp'),
        nodemon = require('gulp-nodemon');

gulp.task('server-run', function() {
    nodemon({
        script: 'server/app.js',
        watch: 'server/',
        env: {NODE_ENV: 'DEVELOPMENT'}
    })
})