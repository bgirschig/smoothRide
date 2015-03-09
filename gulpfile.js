// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var manifest = require('gulp-manifest');
var changed = require('gulp-changed');
var uglify = require('gulp-uglify');

gulp.task("copy", function(){
    gulp.src(['src/**/*.{html,css,png,json}', 'src/.htaccess'])
    .pipe(changed('build'))
    .pipe(gulp.dest('build'));
});

gulp.task("js", function(){
  gulp.src("src/**/*.js")
  .pipe(concat("script/app.js"))
  .pipe(uglify())
  .pipe(gulp.dest('build'));
});

gulp.task('manifest',function(){
    gulp.src('build/**/*.{html,css,js,png,json}')
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*', '*'],
      filename: 'cache.manifest',
      exclude: ['cache.manifest'],
     }))
    .pipe(gulp.dest('build'))
    .pipe(livereload());
});

gulp.task('testTask', function(){});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/**', ['copy']);
    gulp.watch(['build/**','!build/**/cache.manifest'], ['manifest']);
    gulp.watch('src/**/*.js', ['js']);
    livereload.listen();
});

// Default Task
gulp.task("default", ['js','copy', 'manifest', 'watch']);