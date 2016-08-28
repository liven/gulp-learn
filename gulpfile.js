var
    gulp = require('gulp'),
    clean = require( 'gulp-clean'),
    minifyCss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    gls = require('gulp-live-server'),
    minifyJs = require('gulp-minify'),
    sass = require('gulp-sass'),
    ts = require('gulp-typescript'),
    sequence = require('gulp-sequence');

var
    tmpDir = './tmp',
    webDir = './web',
    scriptsDir = webDir + '/scripts';

gulp.task(
    'default',
    sequence(
        ['sass-build', 'ts-build'],
        ['concat-css', 'concat-js'],
        ['minify-css', 'minify-js'],
        'clean'
    )
);

gulp.task('ts-build', function() {
    var tsResult = gulp.src(
        [
            'ts/*.ts'
        ]
    )
        .pipe(ts({
            noImplicitAny: true,
            out: 'typescript.js'
        }));
     return tsResult.js.pipe(gulp.dest(tmpDir));
});

gulp.task('concat-js', function() {
    return gulp.src(
        [
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'tmp/*.js',
            'js/*.js'
        ]
    )
        .pipe(concat('app.js'))
        .pipe(gulp.dest(scriptsDir));
});

gulp.task('concat-css', function() {
    return gulp.src(
        [
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'tmp/*.css',
            'css/*.css'
        ]
    )
        .pipe(concat('app.css'))
        .pipe(gulp.dest(scriptsDir));
});

gulp.task('sass-build', function(){
    return gulp.src('./sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(tmpDir));
});

gulp.task('clean', function() {
    return gulp.src([tmpDir, scriptsDir + '/app.js'], { read: false })
        .pipe( clean({force:true}) )
});

gulp.task('server', function() {
    var server = gls.static(webDir, 8000);
    server.start();
});

gulp.task('minify-css', function(){
    return gulp.src(scriptsDir + '/app.css')
        .pipe(minifyCss({debug: false}))
        .pipe(gulp.dest(scriptsDir));
});

gulp.task('minify-js', function(){
    return gulp.src(scriptsDir + '/app.js')
        .pipe(minifyJs())
        .pipe(gulp.dest(scriptsDir));
});
