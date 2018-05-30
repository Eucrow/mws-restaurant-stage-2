var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var responsive = require('gulp-responsive-images');
const babel = require('gulp-babel');
var concat = require('gulp-concat');

// Concat
gulp.task('scripts', gulp.series(function(){
    return gulp.src('js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist/js'));
}))

// Default task
gulp.task('default', gulp.series('scripts'));


// Static Server + watching scss/html files
gulp.task('serve', gulp.series(function() {

    browserSync.init({
        server: "./",
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
// gulp.task("responsive", function(){
//     gulp.src('./originalimg/*.jpg')
//     .pipe(responsive({
//         '*.jpg':[
//             { width: 350, suffix: "_350"},
//             { width: 700, suffix: "_700"},
//             { width: 800, suffix: "_800"}
//         ]
//     }))
//     .pipe(gulp.dest('./img/'))
// });

// gulp.task('babel', () =>
//     gulp.src('node_modules/idb/lib/idb.js')
//         .pipe(babel({
//             presets: ['env']
//         }))
//         .pipe(gulp.dest('js'))
// );
