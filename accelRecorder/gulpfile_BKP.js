// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var manifest = require('gulp-manifest');
var changed = require('gulp-changed');

gulp.task("copy", function(){
    gulp.src(['src/**/*.{html,css,js,png,json}', 'src/.htaccess'])
    .pipe(changed('build'))
    .pipe(gulp.dest('build'))
});

gulp.task('manifest',function(){
    gulp.src('build/**/*.{html,css,js,png,json}')
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*', '*'],
      filename: 'cache.manifest',
      exclude: ['cache.manifest'],
      basePath:"../"
     }))
    .pipe(gulp.dest('build/manifests'))
    .pipe(livereload());
});

gulp.task('testTask', function(){});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/**', ['copy']);
    gulp.watch(['build/**','!build/**/cache.manifest'], ['manifest']);
    livereload.listen();
});

// Default Task
gulp.task("default", ['copy', 'manifest', 'watch']);