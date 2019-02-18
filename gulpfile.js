var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('scripts', function() {
    return gulp.src('app/js-es6/**/*.js')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	})
});

gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

// Create site directory
gulp.task('useref', function(){
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify())) // Minify if JS file
		.pipe(gulpIf('*.css', cssnano())) // Minify is CSS file
		.pipe(gulp.dest('dist'))
});

// Delete site directory
gulp.task('clean:dist', function() {
	return del.sync('dist');
});


// Need to update as runSequence is not working on
// gulp v4
gulp.task('build', function (callback) {
	runSequence('clean:dist', 
		['sass', 'scripts', 'useref', 'fonts'],
		callback
	)
});

gulp.task('watch', gulp.parallel('browserSync', 'sass', 'scripts', function() {
	gulp.watch('app/scss/**/*.scss', gulp.series('sass')); 
	gulp.watch('app/*.html', browserSync.reload); 
	gulp.watch('app/js-es6/**/*.js', gulp.series('scripts')); 
}));

// Temporary dev build to make sure latest scripts and styling up to date
gulp.task('build:dev', gulp.parallel('sass', 'scripts', 'browserSync', function() {
	return true;
}));