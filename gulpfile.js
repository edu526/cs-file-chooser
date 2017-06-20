var gulp = require('gulp'),
	path = require('path'),
	del = require('del');

gulp.task('clean', function () {
	return del(['./aot', './dist']);
});

gulp.task('copy-assets', function (done) {
	var gTask;
	var sourceFiles = ['src/assets/**/*'];
	var destination = 'dist/assets/';

	gTask = gulp.src(sourceFiles)
		.pipe(gulp.dest(destination));

	if (gTask) gTask.on('end', done);
});

gulp.task('copy-user', function (done) {
	var sourceFiles = path.resolve(__dirname, 'dist/assets/**/*');
	var destination = path.resolve(__dirname, '../../src/assets/');

	var gTask = gulp.src(sourceFiles)
		.pipe(gulp.dest(destination));

	if (gTask) gTask.on('end', done);
});
