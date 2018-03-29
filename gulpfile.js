var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var responsive = require('gulp-responsive-images');

gulp.task('default', defaultTask);

function defaultTask(done) {


// Automatic browser refresh:
// the python server use localhost:8000 to serve the files,
// but browsersync redirect to the ui port, located in
// localhost:8001, but in this direction the python server,
// obviously, doesn't work :(
// I tried this: https://stackoverflow.com/questions/27755206/using-the-original-url-not-proxy-with-browser-sync
// browserSync.init({
//     proxy: "localhost:8000",
//     port: 8000,
//     host: 'localhost',
//     open: 'external',
//     browser: "firefox"
// });


// observa cambio en archivos HTML y recarga el navegador
// gulp.watch("*.html").on("change", browserSync.reload);
// gulp.watch("*.css").on("change", browserSync.reload);
// gulp.watch("*.js").on("change", browserSync.reload);

gulp.watch()

}

// optimización de imágenes de usuario para responsive
// se debería hacer en el backend
gulp.task("responsive", function(){
    gulp.src('./originalimg/*.jpg')
    .pipe(responsive({
        '*.jpg':[
            { width: 1280, suffix: "_1280"},
            { width: 800, suffix: "_800"},
            { width: 400, suffix: "_400"}
        ]
    }))
    .pipe(gulp.dest('./img/'))
});
