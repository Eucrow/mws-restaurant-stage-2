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
const webp = require('gulp-webp');

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
                    './js/idb_main.js'
                    // ,
                    // './js/sw_register.js'
                ])
        .pipe(concat('db.js'))
        .pipe(gulp.dest('dist/js'));
        })
)

// Concat db.js to distribution (contain minification)
gulp.task('scripts-dist-db', gulp.series('minify-css', 'minify-html', function(){
    return gulp.src(['./js/idb.js',
                    './js/dbhelper.js',
                    './js/idb_main.js'])
        .pipe(concat('db.js'))
        .pipe(minify())
        // .pipe(uglify()) // minify
        .pipe(gulp.dest('dist/js'));
    })
)

// Concat restaurant.js to distribution (contain minification)
gulp.task('scripts-dist-restaurant', gulp.series('minify-css', 'minify-html', function(){
    return gulp.src([
                    './js/restaurant_info.js',
                    './js/rating_stars.js',
                    './js/idb_restaurant_info.js',
                    './js/onload_restaurant.js',
                    './js/favorites.js',
                ])
        .pipe(concat('restaurant.js'))
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


// Copy main.js to dist directory
gulp.task('copy-files-2', function(){
    return gulp.src(['./js/main.js'])
        .pipe(gulp.dest('./dist/js'));
})

// Copy all js to dist directory --> only because concat doesn't work properly :(
gulp.task('copy-js-files', function(){
    return gulp.src(['./js/*.js'])
        .pipe(gulp.dest('./dist/js'));
})

// Copy icons to img directory
gulp.task('copy-icons', function(){
    return gulp.src(['./icon_192.png', './icon_512.png'])
        .pipe(gulp.dest('./dist/img'));
})

// Copy images to img directory
gulp.task('copy-images', function(){
    return gulp.src(['./img/*.webp', './img/*.svg'])
        .pipe(gulp.dest('./dist/img'));
})

// Copy html to dist directory
gulp.task('copy-html', function(){
    return gulp.src(['./index.html', './restaurant.html'])
        .pipe(gulp.dest('./dist'));
})

// Default task
gulp.task('default', gulp.series(
    'scripts',
    'copy-files-1',
    'copy-files-2',
    'copy-icons'));
    
    
// Default task to distribution
gulp.task('default-dist', gulp.series(
    // concat doesn't seems to work in the right way, so I just copy the js files to dist/js
    // 'scripts-dist-db',
    // 'scripts-dist-restaurant',
    'copy-js-files',
    'minify-html',
    'minify-css',
    'copy-images',
    'copy-files-1',
    'copy-files-2',
    'copy-icons'));

// Static Server + watching scss/html files
gulp.task('serve-dist', gulp.series('default-dist', function() {

    browserSync.init({
        server: "./dist",
        port: 8000,
        browser: 'chrome'
    });
    browserSync.stream();

    // gulp.watch("*.html").on('change', browserSync.reload);
    // gulp.watch("*.js").on('change', browserSync.reload);
    // gulp.watch("**/*.js").on('change', browserSync.reload);
    // gulp.watch("/js/*.js").on('change', browserSync.reload);
    // gulp.watch("**/*.css").on("change", browserSync.reload);
    // gulp.watch("manifest.json").on("change", browserSync.reload);

}));

// Static Server + watching scss/html files
gulp.task('serve', gulp.series(function() {

    browserSync.init({
        // server: "./dist",
        server: "./",
        port: 8000,
        browser: 'chrome'
    });
    browserSync.stream();

    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("*.js").on('change', browserSync.reload);
    gulp.watch("**/*.js").on('change', browserSync.reload);
    gulp.watch("/js/*.js").on('change', browserSync.reload);
    gulp.watch("**/*.css").on("change", browserSync.reload);
    gulp.watch("manifest.json").on("change", browserSync.reload);
}));

// convert images to webp
gulp.task('convertToWEBP', () =>
    gulp.src('./img/*.jpg')
        .pipe(webp())
        .pipe(gulp.dest('./img/'))
);

// optimización de imágenes de usuario para responsive
// se debería hacer en el backend
gulp.task('responsive', gulp.series(function(){
    return gulp.src('./img/*.webp')
    .pipe(responsive({
        '*.webp':[
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
