const gulp = require('gulp');
const { src, dest, parallel, series, watch, lastRun } = require('gulp');
const sourceMap = require('gulp-sourcemaps');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoPrefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const zip = require('gulp-zip');
const uglifyJs = require('gulp-uglify');
const img = require('gulp-image');
const connect = require('gulp-connect');
const newer = require('gulp-newer');
// process.env.ABRAIA_KEY = 'NWQ2ZTE3MzBhNzgwMDAwMDpKNlM4MGc2ZW9kODNvNzFXUWNtNHp0Q3pOV1RWQUs1cg==';
// const video = require('gulp-abraia');

const htmlTask = () => {
	return src('./src/html/pages/*.pug', { since: lastRun(htmlTask) })
		.pipe(newer('dist/html/pages/'))
		.pipe(sourceMap.init())
		.pipe(pug())
		.pipe(concat('index.html'))
		.pipe(sourceMap.write('.'))
		.pipe(dest('dist/'))
		.pipe(connect.reload());
};
const cssTask = () => {
	return src('./src/css/*.scss', { since: lastRun(cssTask) })
		.pipe(newer('dist/css/'))
		.pipe(sourceMap.init())
		.pipe(sass({ outputStyle: 'compressed' }))
		.on('error', sass.logError)
		.pipe(autoPrefixer())
		.pipe(concat('styles.css'))
		.pipe(sourceMap.write('.'))
		.pipe(dest('dist/css/'))
		.pipe(connect.reload());
};
const jsTask = () => {
	return src('./src/js/*.js', { since: lastRun(jsTask) })
		.pipe(newer('dist/js/'))
		.pipe(sourceMap.init())
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(concat('index.js'))
		.pipe(uglifyJs())
		.pipe(sourceMap.write('.'))
		.pipe(dest('dist/js/'))
		.pipe(connect.reload());
};
const imgTask = () => {
	return src('./src/img/*', { since: lastRun(imgTask) })
		.pipe(newer('dist/img'))
		.pipe(img())
		.pipe(dest('dist/img/'));
};

// const videoTask = () => {
// 	return src('./src/img/*', { since: lastRun(videoTask) })
// 		.pipe(newer('dist/img'))
// 		.pipe(video())
// 		.pipe(dest('dist/img/'));
// };

const compressTask = () => {
	return src('dist/**/*.*').pipe(zip('app.zip')).pipe(dest('.'));
};
const syncTask = () => {
	return connect.server({ root: 'dist', livereload: true });
};

const watchTask = () => {
	return watch(
		[
			'./src/html/**/*.pug',
			'./src/css/**/*.scss',
			'./src/js/*.js',
			'./src/img/*',
		],
		series(htmlTask, cssTask, jsTask, imgTask),
	);
};

exports.html = htmlTask;
exports.css = cssTask;
exports.js = jsTask;
exports.img = imgTask;
// exports.video = videoTask;
exports.compress = compressTask;
exports.sync = syncTask;
exports.build = compressTask;
exports.default = parallel(watchTask, syncTask);
