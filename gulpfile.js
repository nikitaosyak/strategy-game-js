const   gulp = require('gulp');

gulp.task('server-run', function() {
    const nodemon = require('gulp-nodemon')
    const path = require('path')
    nodemon({
        script: path.join(__dirname, 'server', 'src', 'app.js'),
        watch: path.join(__dirname, 'server', 'src'),
        env: {NODE_ENV: 'DEVELOPMENT'},
        cwd: path.join(__dirname, 'server', 'src')
    })
})