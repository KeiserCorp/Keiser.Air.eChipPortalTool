var gulp = require('gulp');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var util = require('gulp-util');

var less = require('gulp-less');

var srcDir = './src/';
var jsSrcDir = srcDir + 'js/';
var lessSrcDir = srcDir + 'less/';
var appDir = './app/';

var mainScript = jsSrcDir + 'main.js';
var mainStyle = lessSrcDir + 'main.less';
var fontFiles = [
	'./node_modules/uikit/dist/fonts/*.*'
];

var production = !!util.env.production;
if (production) {
	process.env.NODE_ENV = 'production';
}

gulp.task('js-bundle', function () {
	browserify(mainScript).bundle()
	.pipe(source(mainScript))
	.pipe(production ? streamify(uglify()) : util.noop())
	.pipe(rename({
			dirname : "/",
			basename : "bundle"
		}))
	.pipe(gulp.dest(appDir));
});

gulp.task('css-bundle', function () {
	return gulp.src(mainStyle)
	.pipe(less())
	.pipe(rename({
			dirname : "/",
			basename : "bundle"
		}))
	.pipe(gulp.dest(appDir));
});

gulp.task('move-fonts', function () {
	gulp.src(fontFiles)
	.pipe(rename({
			dirname : "/fonts"
		}))
	.pipe(gulp.dest(appDir));
});

gulp.task('default', function () {
	gulp.start('js-bundle', 'css-bundle', 'move-fonts');
});

gulp.task('watch', function () {
	gulp.watch(srcDir + '**/*.js', ['js-bundle']);
	gulp.watch(srcDir + '**/*.less', ['css-bundle']);
});
