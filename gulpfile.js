var gulp = require('gulp');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var util = require('gulp-util');

var jsDir = './js/';
var appDir = './app/';
var mainjs = jsDir + 'main.js';
var production = !!util.env.production;

gulp.task('bundle', function () {
	browserify(mainjs).bundle()
	.pipe(source(mainjs))
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
	gulp.watch(mainjs, ['bundle']);
});
