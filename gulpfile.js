var gulp = require('gulp');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var util = require('gulp-util');
var minifyCss = require('gulp-minify-css');
var less = require('gulp-less');
var handlebars = require('gulp-compile-handlebars');
var markdown = require('gulp-markdown');
var uncss = require('gulp-uncss');


var srcDir = './src/';
var jsSrcDir = srcDir + 'js/';
var lessSrcDir = srcDir + 'less/';
var htmlSrcDir = srcDir + 'html/';
var appDir = './app/';
var externalTestDir = './external-test/';

var mainScript = jsSrcDir + 'main.js';
var backgroundScript = jsSrcDir + 'background.js';
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
	browserify(mainScript)
		.bundle()
		.pipe(source(mainScript))
		.pipe(production ? streamify(uglify().on('error', util.log)) : util.noop())
		.pipe(rename({
			dirname: '/',
			basename: 'bundle'
		}))
		.pipe(gulp.dest(appDir));
});

gulp.task('background-bundle', function () {
	browserify(backgroundScript)
		.bundle()
		.pipe(source(backgroundScript))
		.pipe(production ? streamify(uglify()) : util.noop())
		.pipe(rename({
			dirname: '/',
			basename: 'background'
		}))
		.pipe(gulp.dest(appDir));
});

gulp.task('css-bundle', function () {
	return gulp.src(mainStyle)
		.pipe(less())
		.pipe(production ? uncss({
			html: [appDir + 'index.html'],
			ignore: [/uk\-modal/, /uk\-form/, /pre\.syntax\-highlight/, /.*\.uk\-tab/]
		}) : util.noop())
		.pipe(production ? minifyCss() : util.noop())
		.pipe(rename({
			dirname: '/',
			basename: 'bundle'
		}))
		.pipe(gulp.dest(appDir));
});

gulp.task('move-fonts', function () {
	gulp.src(fontFiles)
		.pipe(rename({
			dirname: '/fonts'
		}))
		.pipe(gulp.dest(appDir));
});

gulp.task('external-bundle', function () {
	var externalTestFile = externalTestDir + 'src/main.js';
	browserify(externalTestFile)
		.bundle()
		.pipe(source(externalTestFile))
		.pipe(production ? streamify(uglify()) : util.noop())
		.pipe(rename({
			dirname: '/',
			basename: 'bundle'
		}))
		.pipe(gulp.dest(externalTestDir + 'dist'));
});

gulp.task('html-render', function () {
	var templateData = {};
	var options = {
		batch: [htmlSrcDir + 'partials', htmlSrcDir + 'md/rendered']
	};

	return gulp.src(htmlSrcDir + 'index.html')
		.pipe(handlebars(templateData, options))
		.pipe(rename('index.html'))
		.pipe(gulp.dest(appDir));
});

gulp.task('docs-transform', function () {
	return gulp.src(htmlSrcDir + 'md/*.md')
		.pipe(markdown())
		.pipe(rename({
			extname: '.html'
		}))
		.pipe(gulp.dest(htmlSrcDir + 'md/rendered/'));
});

gulp.task('default', function () {
	runSequence(
		['js-bundle', 'background-bundle', 'move-fonts', 'external-bundle', 'docs-transform'], ['html-render'], ['css-bundle']
	);
});

gulp.task('watch', function () {
	gulp.watch([jsSrcDir + '**/*.js', '!' + jsSrcDir + 'background.js'], ['js-bundle']);
	gulp.watch(jsSrcDir + 'background.js', ['background-bundle']);
	gulp.watch(lessSrcDir + '**/*.less', ['css-bundle']);
	gulp.watch(externalTestDir + 'src/**/*.js', ['external-bundle']);
	gulp.watch(htmlSrcDir + '**/*.html', ['html-render']);
});
