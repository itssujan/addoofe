var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    wrap = require('gulp-wrap'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-cssnano'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    prefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-htmlmin'),
    rev = require('gulp-rev');
	runSequence = require('run-sequence'),
	clean = require('gulp-clean'),
	RevAll = require('gulp-rev-all'),
	gulpif = require('gulp-if'),
    argv = require('yargs').argv;

var paths = {
	scripts: 'src/js/**/*.*',
	styles: 'src/less/**/*.*',
	images: 'src/img/**/*.*',
	templates: 'src/templates/**/*.html',
	index: 'src/index.html',
	bower_fonts: 'src/components/**/*.{ttf,woff,eof,svg}',
	swf: 'src/components/zeroclipboard/dist/*.swf'
};

var targetDir = 'temp';

if(!argv.production) {
	targetDir = 'dist';
}


function runAllTasks(cb) {
	if(argv.production) {
		runSequence('pretasks', 'startserver' ,'posttask-prod', 'cleanup', cb);
	} else {
		runSequence('pretasks', 'startserver' ,'posttask', 'cleanup', cb);
	}
}


function buildProject(cb) {
	if(argv.production) {
		runSequence('pretasks' ,'posttask-prod', 'cleanup', cb);
	} else {
		runSequence('pretasks' ,'posttask', 'cleanup', cb);
	}
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
        .pipe(gulp.dest(targetDir+'/lib'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['custom-images', 'custom-js', 'custom-less', 'custom-templates', 'custom-swf','custom-css']);

gulp.task('custom-images', function () {
	return gulp.src(paths.images)
        .pipe(gulp.dest(targetDir+'/img'));
});

gulp.task('custom-js', function () {
	if (process.env.AddooENV === 'development') {
		return gulp.src(paths.scripts)
			.pipe(sourcemaps.init())
			.pipe(minifyJs())
			.pipe(concat('dashboard.min.js'))
			.pipe(sourcemaps.write('maps'))
			.pipe(gulp.dest(targetDir+'/js'));
	} else {
		return gulp.src(paths.scripts)
			.pipe(minifyJs())
			.pipe(concat('dashboard.min.js'))
			.pipe(gulp.dest(targetDir+'/js'));
	}
});

gulp.task('custom-less', function () {
	return gulp.src(paths.styles)
        .pipe(less())
        .pipe(gulp.dest(targetDir+'/css'))
        .pipe(gulp.dest('src/css'));
});

gulp.task('custom-templates', function () {
	return gulp.src(paths.templates)
        .pipe(minifyHTML())
        .pipe(gulp.dest(targetDir+'/templates'));
});

gulp.task('custom-swf', function () {
	return gulp.src(paths.swf)
        .pipe(gulp.dest(targetDir+'/swf'));
});

gulp.task('custom-css', function () {
	return gulp.src("src/components/videogular-themes-default/videogular.css")
        .pipe(gulp.dest(targetDir+'/css'));
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
	gulp.watch(["src/components/videogular-themes-default/videogular.css"], ['custom-css']);
});

/**
 * Live reload server
 */
gulp.task('webserver', function () {
	connect.server({
		root: 'dist',
		livereload: false,
		port: process.env.PORT || 8888
	});
});

gulp.task('livereload', function () {
	gulp.src([targetDir+'/**/*.*'])
        .pipe(watch([targetDir+'/**/*.*']))
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
        .pipe(gulp.dest('temp/'));
});

gulp.task('revAll', ['usemin'], function () {
	var revAll = new RevAll({ 
		dontRenameFile: [/^\/favicon.ico$/g, 'index.html','uploadtemplate.html'], 
		dontupdatereference: [/^\/favicon.ico$/g, 'index.html', 'uploadtemplate.html']
	});
	
	if (process.env.AddooENV === 'development') {
		return gulp.src(targetDir+'/**/*.*')
        .pipe(gulp.dest('dist/'))
	} else {
		return gulp.src(targetDir+'/**/*.*')
		.pipe(revAll.revision())
        .pipe(gulp.dest('dist/'))
		.pipe(revAll.manifestFile())
		.pipe(gulp.dest('dist/'));
	}
});



gulp.task('clean' , function () {
  return gulp.src(['src/css', 'temp'], {read: false})
    .pipe(clean());
});



/**
 * Gulp tasks
 */
gulp.task('pretasks', ['build-assets', 'build-custom']);
gulp.task('startserver', ['webserver', 'livereload', 'watch']);
gulp.task('posttask', ['usemin']);
gulp.task('posttask-prod', ['usemin', 'revAll']);
gulp.task('cleanup', [ 'clean']);
gulp.task('default', runAllTasks);
gulp.task('build', buildProject);
