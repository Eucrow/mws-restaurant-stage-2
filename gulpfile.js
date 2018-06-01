var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var responsive = require('gulp-responsive-images');
const babel = require('gulp-babel');
var concat = require('gulp-concat');

// uglify minify es5 with uglify-js library (which is
// automaticaly installed). To use es6 first must install
// uglify-es (to work with ws6) and then use 'composer'
// command of gulp-uglify
var UglifyJS = require("uglify-es");
var composer = require('gulp-uglify/composer');
var minify = composer(UglifyJS, console);
// var uglify = require('gulp-uglify');

// Concat
gulp.task('scripts', gulp.series(function(){
    return gulp.src(['./js/idb.js',
                    './js/dbhelper.js',
                    './js/idbmain.js',
                    './js/sw_register.js'])
        .pipe(concat('db.js'))
        .pipe(gulp.dest('dist/js'));
}))

// Concat to distribution (contain minification)
gulp.task('scripts-dist', gulp.series(function(){
    return gulp.src(['./js/idb.js',
                    './js/dbhelper.js',
                    './js/idbmain.js',
                    './js/sw_register.js'])
        .pipe(concat('db.js'))
        .pipe(minify())
        // .pipe(uglify()) // minify
        .pipe(gulp.dest('dist/js'));
}))
// Copy index.html, restaurant.html and sw.js to dist directory
gulp.task('copy-files-1', function(...args){
    return gulp.src(['./index.html', 'restaurant.html', 'sw.js'])
        .pipe(gulp.dest('./dist'));
})

// Copy main.js and restaurant_info.js to dist directory
gulp.task('copy-files-2', function(...args){
    return gulp.src(['./js/main.js', './js/restaurant_info.js'])
        .pipe(gulp.dest('./dist/js'));
})

// Default task
gulp.task('default', gulp.series(
    'scripts',
    'copy-files-1',
    'copy-files-2'));

// Default task to distribution
gulp.task('default-dist', gulp.series(
    'scripts-dist',
    'copy-files-1',
    'copy-files-2'));


// Static Server + watching scss/html files
gulp.task('serve', gulp.series(function() {

    browserSync.init({
        server: "./dist",
        port: 8000,
        browser: 'chrome'
    });
    browserSync.stream();

    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("**/*.js").on('change', browserSync.reload);
    gulp.watch("**/*.css").on("change", browserSync.reload);
}));

// optimización de imágenes de usuario para responsive
// se debería hacer en el backend
gulp.task('responsive', gulp.series(function(){
    return gulp.src('./img/*.jpg')
    .pipe(responsive({
        '*.jpg':[
            { width: 350, suffix: "_350"},
            { width: 700, suffix: "_700"},
            { width: 800, suffix: "_800"}
        ]
    }))
    .pipe(gulp.dest('./dist/img/'))
}));

// gulp.task('babel', () =>
//     gulp.src('node_modules/idb/lib/idb.js')
//         .pipe(babel({
//             presets: ['env']
//         }))
//         .pipe(gulp.dest('js'))
// );
