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
let cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');

// Minify html
gulp.task('minify-html', function() {
  return gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('dist'));
});

// Minify css
gulp.task('minify-css', () => {
  return gulp.src('./css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
});

// Concat
gulp.task('scripts', gulp.series(function(){
    return gulp.src(['./js/idb.js',
                    './js/dbhelper.js',
                    './js/idbmain.js'
                    // ,
                    // './js/sw_register.js'
                ])
        .pipe(concat('db.js'))
        .pipe(gulp.dest('dist/js'));
        })
)

// Concat to distribution (contain minification)
gulp.task('scripts-dist', gulp.series('minify-css', 'minify-html', function(){
    return gulp.src(['./js/idb.js',
                    './js/dbhelper.js',
                    './js/idbmain.js'])
        .pipe(concat('db.js'))
        .pipe(minify())
        // .pipe(uglify()) // minify
        .pipe(gulp.dest('dist/js'));
    })
)
// Copy manifest.json and sw.js to dist directory
gulp.task('copy-files-1', function(){
    return gulp.src(['manifest.json', 'sw.js'])
        .pipe(gulp.dest('./dist'));
})


// Copy main.js and restaurant_info.js to dist directory
gulp.task('copy-files-2', function(){
    return gulp.src(['./js/main.js', './js/restaurant_info.js'])
        .pipe(gulp.dest('./dist/js'));
})

// Copy icons to img directory
gulp.task('copy-icons', function(){
    return gulp.src(['./icon_192.png', './icon_512.png'])
        .pipe(gulp.dest('./dist/img'));
})


// Default task
gulp.task('default', gulp.series(
    'scripts',
    'copy-files-1',
    'copy-files-2',
    'copy-icons'));


// Default task to distribution
gulp.task('default-dist', gulp.series(
    'scripts-dist',
    'copy-files-1',
    'copy-files-2',
    'copy-icons'));


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
    gulp.watch("manifest.json").on("change", browserSync.reload);
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
