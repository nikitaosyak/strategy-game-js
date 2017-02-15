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

    const isWin = /^win/.test(process.platform);
    // const d = isWin ? '\\' : '\/';
    // const regex = new RegExp('^.*src' + d + '.*\.js', 'i');
    const through = require('through2')
    const sort = require('gulp-sort')

    htmlDeps = "";
    return gulp.src(['src/**/*.js'])
        .pipe(sort({
            comparator: (f1, f2) => {
                let result = 0
                const contents1 = f1._contents.toString('utf8')
                const f1Import = contents1.match(/^import.*/gm) !== null
                const contents2 = f2._contents.toString('utf8')
                const f2Import = contents2.match(/^import.*/gm) !== null
                // console.log(f1Import, f2Import)

                if (f1Import) result = 1
                if (f2Import) result = -1
                if (f1Import && f2Import) result = 0
                return result
            }
        }))
        .pipe(through.obj(function(ch, enc, cb) {
            let partialPath = ch.path.replace(/^.*src./i, '');
            partialPath = isWin ? partialPath.split('\\').join('/') : partialPath
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
    const babel = require('gulp-babel')

    // gulp.src(['src/js/**/*.js'])
    //     // .pipe(replace(/^import.*/gm, '\n'))
    //     .pipe(babel({presets: ['es2015']}))
    //     // .pipe(replace(/.*exports.*__esModule.*\n(.*\n)(.*\n)/im, '\n'))
    //     // .pipe(replace(/exports..* =/im, ''))
    //     .pipe(gulp.dest('build/js'));

    gulp.src('src/lib/**/*.js').pipe(gulp.dest('build/lib/'))

    gulp.src(['src/index.html'])
        // .pipe(replace(/.*<!-- GENERATED DEPS HERE -->.*/m, htmlDeps))
        .pipe(gulp.dest('build/'));

    gulp.src('assets/**/*')
        .pipe(gulp.dest('build/assets'))

    // gulp.src(['src/**/*']).pipe(connect.reload());
});

gulp.task('test-webpack', () => {
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

    gulp.src('src/js/**/*.js')
        .pipe(stream(config, webpack2))
        .pipe(gulp.dest('build/'))
})

gulp.task('watch', function() {
    'use strict'
    gulp.watch(['src/**/*', 'assets/**/*'], ['deploy-raw']);
});

gulp.task('default', ['connect', 'deploy-raw', 'watch'])