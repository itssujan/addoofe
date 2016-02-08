var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    wrap = require('gulp-wrap'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-cssnano'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
	// sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    prefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-htmlmin'),
    rev = require('gulp-rev');
	runSequence = require('run-sequence');


var paths = {
	scripts: 'src/js/**/*.*',
	styles: 'src/less/**/*.*',
	images: 'src/img/**/*.*',
	templates: 'src/templates/**/*.html',
	index: 'src/index.html',
	bower_fonts: 'src/components/**/*.{ttf,woff,eof,svg}',
	swf: 'src/components/zeroclipboard/dist/*.swf'
};


function runAllTasks(cb) {
	runSequence('pretasks', 'posttask', cb);
}


/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-bower_fonts']);

gulp.task('copy-bower_fonts', function () {
	return gulp.src(paths.bower_fonts)
        .pipe(rename({
        	dirname: '/fonts'
        }))
        .pipe(gulp.dest('dist/lib'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['custom-images', 'custom-js', 'custom-less', 'custom-templates', 'custom-swf']);

gulp.task('custom-images', function () {
	return gulp.src(paths.images)
        .pipe(gulp.dest('dist/img'));
});

gulp.task('custom-js', function () {
	// if (process.env.AddooENV === 'development') {
	// 	return gulp.src(paths.scripts)
	// 		.pipe(sourcemaps.init())
	// 		.pipe(minifyJs())
	// 		.pipe(concat('dashboard.min.js'))
	// 		.pipe(sourcemaps.write('maps'))
	// 		.pipe(gulp.dest('dist/js'));
	// } else {
		return gulp.src(paths.scripts)
			.pipe(minifyJs())
			.pipe(concat('dashboard.min.js'))
			.pipe(gulp.dest('dist/js'));
	// }
});

gulp.task('custom-less', function () {
	return gulp.src(paths.styles)
        .pipe(less())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('custom-templates', function () {
	return gulp.src(paths.templates)
        .pipe(minifyHTML())
        .pipe(gulp.dest('dist/templates'));
});

gulp.task('custom-swf', function () {
	return gulp.src(paths.swf)
        .pipe(gulp.dest('dist/swf'));
});

/**
 * Watch custom files
 */
gulp.task('watch', function () {
	gulp.watch([paths.images], ['custom-images']);
	gulp.watch([paths.styles], ['custom-less']);
	gulp.watch([paths.scripts], ['custom-js']);
	gulp.watch([paths.templates], ['custom-templates']);
	gulp.watch([paths.index], ['usemin']);
	gulp.watch([paths.swf], ['custom-swf']);
});

/**
 * Live reload server
 */
gulp.task('webserver', function () {
	connect.server({
		root: 'dist',
		livereload: true,
		port: process.env.PORT || 8888
	});
});

gulp.task('livereload', function () {
	gulp.src(['dist/**/*.*'])
        .pipe(watch(['dist/**/*.*']))
        .pipe(connect.reload());
});

/**
 * Handle bower components from index
 */
gulp.task('usemin', function () {
	return gulp.src(paths.index)
        .pipe(usemin({
        	js: [minifyJs(), 'concat'],
        	css: [minifyCss({ keepSpecialComments: 0 }), 'concat'],
        }))
        .pipe(gulp.dest('dist/'));
});


/**
 * Gulp tasks
 */
gulp.task('pretasks', ['build-assets', 'build-custom', 'webserver', 'livereload', 'watch']);
gulp.task('posttask', ['usemin']);
gulp.task('default', runAllTasks);
