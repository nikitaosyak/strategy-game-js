const gulp = require('gulp')
const connect = require('gulp-connect')

gulp.task('connect', function() {
    connect.server({
        root: 'build/',
        port: '8080',
        livereload: true
    });
});

gulp.task('clean', function() {
    const clean = require('gulp-clean')
    return gulp.src('build/', {read: false}).pipe(clean());
});

gulp.task('pack', ['clean'], () => {
    const stream = require('webpack-stream')
    const webpack2 = require('webpack')

    const config = {
        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }]
        },
        output: {
            filename: 'bundle.js'
        }
    }

    return gulp.src('src/js/**/*.js')
        .pipe(stream(config, webpack2))
        .pipe(gulp.dest('build/'))
})

gulp.task('deploy-static', ['clean'], () => {
    gulp.src('src/lib/**/*.js').pipe(gulp.dest('build/lib/'))

    gulp.src(['src/index.html'])
        .pipe(gulp.dest('build/'));

    gulp.src('assets/**/*')
        .pipe(gulp.dest('build/assets'))
})

gulp.task('deploy', ['clean', 'pack', 'deploy-static'], () => {
    gulp.src(['src/**/*']).pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch(['src/**/*', 'assets/**/*'], ['deploy']);
});

gulp.task('default', ['connect', 'deploy', 'watch'])