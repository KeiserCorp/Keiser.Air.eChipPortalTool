var gulp = require('gulp');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var util = require('gulp-util');
var minifyCss = require('gulp-minify-css');
var less = require('gulp-less');

var srcDir = './src/';
var jsSrcDir = srcDir + 'js/';
var lessSrcDir = srcDir + 'less/';
var appDir = './app/';
var externalTestDir = './external-test/';

var mainScript = jsSrcDir + 'main.js';
var mainStyle = lessSrcDir + 'main.less';
var fontFiles = [
	'./node_modules/uikit/dist/fonts/*.*'
];

var production = !!util.env.production;
if (production) {
	process.env.NODE_ENV = 'production';
} else {
	process.env.NODE_ENV = 'development';
}

gulp.task('js-bundle', function () {
	browserify(mainScript).bundle()
	.pipe(source(mainScript))
	.pipe(production ? streamify(uglify()) : util.noop())
	.pipe(rename({
			dirname : '/',
			basename : 'bundle'
		}))
	.pipe(gulp.dest(appDir));
});

gulp.task('css-bundle', function () {
	return gulp.src(mainStyle)
	.pipe(less())
	.pipe(production ? minifyCss() : util.noop())
	.pipe(rename({
			dirname : '/',
			basename : 'bundle'
		}))
	.pipe(gulp.dest(appDir));
});

gulp.task('move-fonts', function () {
	gulp.src(fontFiles)
	.pipe(rename({
			dirname : '/fonts'
		}))
	.pipe(gulp.dest(appDir));
});

gulp.task('external-bundle', function () {
	var externalTestFile = externalTestDir + 'src/main.js';
	browserify(externalTestFile).bundle()
	.pipe(source(externalTestFile))
	.pipe(production ? streamify(uglify()) : util.noop())
	.pipe(rename({
			dirname : '/',
			basename : 'bundle'
		}))
	.pipe(gulp.dest(externalTestDir + '/dist'));
});

gulp.task('default', function () {
	gulp.start('js-bundle', 'css-bundle', 'move-fonts', 'external-bundle');
});

gulp.task('watch', function () {
	gulp.watch(jsSrcDir + '**/*.js', ['js-bundle']);
	gulp.watch(lessSrcDir + '**/*.less', ['css-bundle']);
	gulp.watch(externalTestDir + 'src/**/*.js', ['external-bundle']);
});
