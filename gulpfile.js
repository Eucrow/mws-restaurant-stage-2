var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('default', defaultTask);

function defaultTask(done) {

browserSync.init({
    proxy: "localhost:8000",
    port: 8000,
    browser: "firefox"
});

// observa cambio en archivos HTML y recarga el navegador
gulp.watch("*.html").on("change", browserSync.reload);
gulp.watch("*.css").on("change", browserSync.reload);
gulp.watch("*.js").on("change", browserSync.reload);

gulp.watch()

}

