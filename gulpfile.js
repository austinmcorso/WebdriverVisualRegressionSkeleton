var gulp = require('gulp');
var argv = require('minimist')(process.argv.slice(2));
var webdriver = require('gulp-webdriver');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var environments = require('./environments.json');

/**
 * Validate environment argument.
 */
gulp.task('set-env', function() {
  if (!argv.hasOwnProperty('env')) {
    argv.env = 'prod';
  }
  if (argv.hasOwnProperty('env') && !environments.hasOwnProperty(argv.env)) {
    throw new Error('Invalid environment passed as argument.');
  }
});

/**
 * Move screenshots from environment dir to root dir for webdriver to read.
 */
gulp.task('move-shots-prior', ['set-env'], function() {
  gulp.src('./results/' + argv.env + '/screenshots/*').pipe(clean()).pipe(gulp.dest('./screenshots'));
  gulp.src('./results/' + argv.env + '/diffs/*').pipe(clean()).pipe(gulp.dest('./diffs'));
});

/**
 * Run tests. Use plumber to continue with subsequent tasks regardless of errors.
 */
gulp.task('webdriver', ['set-env', 'move-shots-prior'], function() {
  return gulp.src('wdio.conf.js')
    .pipe(plumber({
      'errorHandler': function(err){
        console.log(err);
        this.emit('end');
      }}))
    .pipe(webdriver({
      baseUrl: environments[argv.env],
    }));
});

/**
 * Move screenshots from root dir to environment dir.
 */
gulp.task('move-shots-after', ['set-env', 'move-shots-prior', 'webdriver'], function() {
  gulp.src('./screenshots/*').pipe(clean()).pipe(gulp.dest('./results/' + argv.env + '/screenshots/'));
  gulp.src('./diffs/*').pipe(clean()).pipe(gulp.dest('./results/' + argv.env + '/diffs/'));
});

/**
 * Clear environments baselines.
 */
gulp.task('reset-baselines', ['set-env'], function() {
  return gulp.src('./results/' + argv.env + '/')
    .pipe(clean());
});

gulp.task('default', ['set-env', 'move-shots-prior', 'webdriver', 'move-shots-after']);
