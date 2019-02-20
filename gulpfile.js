const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const del = require('del');
const runSequence = require('run-sequence');
const babel = require('gulp-babel');

gulp.task('sass', function() {
	return gulp.src('app/src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/public/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('scripts', function() {
	return gulp.src('app/src/js-es6/**/*.js')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(gulp.dest('app/public/js'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'app/public'
		},
	})
});

gulp.task('fonts', function() {
	return gulp.src('app/public/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))
});

// Create site directory
gulp.task('useref', function(){
	return gulp.src('app/public/*.html')
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
	gulp.watch('app/src/scss/**/*.scss', gulp.series('sass')); 
	gulp.watch('app/src/*.html').on('change', browserSync.reload);
	gulp.watch('app/src/js-es6/**/*.js', gulp.series('scripts')); 
}));

// Temporary dev build to make sure latest scripts and styling up to date
gulp.task('build:dev', gulp.parallel('sass', 'scripts', 'browserSync', function() {
	return true;
}));