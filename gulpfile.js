var gulp = require('gulp');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var webdriver = require('gulp-webdriver');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var environments = require('./environments.json');

/**
 * Validate environment argument.
 */
gulp.task('set-env', function() {
  if (!argv.hasOwnProperty('env') && environments.hasOwnProperty('prod')) {
    argv.env = 'prod';
  }
  if (argv.hasOwnProperty('env') && !environments.hasOwnProperty(argv.env)) {
    throw new Error('Invalid environment passed as argument.');
  }
});

/**
 * Symlink Webdriver directories to environment directories.
 */
gulp.task('symlinks-create', ['set-env'], function() {
  var links = ['screenshots', 'diffs', 'test-results.json'];

  fs.stat('./results', function(err, stats) {
    if (err) {
      fs.mkdirSync('./results');
    }

    fs.stat('./results/' + argv.env, function(err, stats) {
      if (err) {
        fs.mkdirSync('./results/' + argv.env);
      }

      links.forEach(function(link) {
        fs.stat('./results/' + argv.env + '/' + link, function(err, stats) {
          if (err) {
            if (link.indexOf('.') === -1) {
              fs.mkdir('./results/' + argv.env + '/' + link);
            } else {
              fs.writeFile('./results/' + argv.env + '/' + link, '{}');
            }
          }
        });
        fs.symlink('./results/' + argv.env + '/' + link, link);
      });
    });
  });
});

/**
 * Run tests. Use plumber to continue with subsequent tasks regardless of errors.
 */
gulp.task('webdriver', ['set-env', 'symlinks-create'], function() {
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
 * Remove Webdriver directory symlinks.
 */
gulp.task('symlinks-remove', ['set-env', 'symlinks-create', 'webdriver'], function() {
  fs.unlink('screenshots');
  fs.unlink('diffs');
  fs.unlink('test-results.json');
});

/**
 * Clear environments baselines.
 */
gulp.task('reset-baselines', ['set-env'], function() {
  return gulp.src('./results/' + argv.env + '/')
    .pipe(clean());
});

gulp.task('default', ['set-env', 'symlinks-create', 'webdriver', 'symlinks-remove']);

