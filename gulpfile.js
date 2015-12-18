var gulp = require('gulp');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var util = require('gulp-util');

var srcDir = './src/';
var appDir = './app/';
var mainScript = srcDir + 'main.js';
var production = !!util.env.production;

if (production){
	process.env.NODE_ENV = 'production';
}

gulp.task('bundle', function () {
	browserify(mainScript).bundle()
	.pipe(source(mainScript))
	.pipe(production ? streamify(uglify()) : util.noop())
	.pipe(rename({
			dirname : "/",
			basename : "bundle"
		}))
	.pipe(gulp.dest(appDir));
});

gulp.task('default', function () {
	gulp.start('bundle');
});

gulp.task('watch', function () {
	gulp.watch(srcDir + '**/*.js', ['bundle']);
});
