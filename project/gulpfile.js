var path = require('path');
var source = require('vinyl-source-stream');
var minimist = require('minimist');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var preprocess = require('gulp-preprocess');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var stylus = require('gulp-stylus');
var minifyCss = require('gulp-minify-css');
var streamify = require('gulp-streamify');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');

// command line options
var minimistOptions = {
  string: ['env', 'mode'],
  default: { env: 'env.json', mode: 'dev' }
};

var options = minimist(process.argv.slice(2), minimistOptions);

var paths = {
  styles: ['src/styl/reset.styl', 'src/styl/common.styl', 'src/styl/form.styl',
           'src/styl/overlay.styl', 'src/stl/overlap-popup.styl', 'src/styl/*.styl'
          ]
};

var handleError = function(error) {
  gutil.log(gutil.colors.red(error.message));
};

function buildHtml(src, dest, context) {
  console.log(context);
  return gulp.src(path.join(src, 'index.html'))
    .pipe(preprocess({ context: context }))
    .pipe(gulp.dest(dest));
}

function buildStyl(src, dest, mode) {
  return gulp.src(src)
    .pipe(stylus())
    .pipe(streamify(autoprefixer()))
    .pipe(gulpif(mode === 'prod', minifyCss()))
    .pipe(rename('app.css'))
    .pipe(gulp.dest(dest + '/css/compiled/'));
}

function buildScripts(src, dest, mode) {
  var opts = (mode === 'dev') ? { debug: true } : {};

  return browserify(src + '/js/main.js', opts)
    .transform(babelify, { presets: ['es2015']})
    .bundle()
    .on('error', handleError)
    .pipe(source('app.js'))
    .pipe(gulp.dest(dest));
}

function watchScripts(src, dest, mode) {
  var opts = watchify.args;
  opts.debug = true;

  var bundleStream = watchify(
    browserify(src + '/js/main.js', opts)
      .transform(babelify, { presets: ['es2015']})
  );

  function rebundle(ids) {
    return bundleStream
      .bundle()
      .on('error', handleError)
      .on('end', handleTarifa)
      .pipe(source('app.js'))
      .pipe(gulp.dest(dest));
  }

  bundleStream.on('update', rebundle);
  bundleStream.on('log', gutil.log);

  return rebundle();
}

function watchLaunch() {
  gulp.watch(paths.styles, ['styl']);
  gulp.watch(['src/index.html', 'env.json'], ['html']);
}

gulp.task('html', function() {
  var context = require('./' + options.env);
  context.MODE = options.mode;

  return buildHtml('src', 'www', context)
    .on('end', handleTarifa);
});

gulp.task('styl', function() {
  return buildStyl('src/styl/index.styl', 'www', options.mode)
    .on('end', handleTarifa);
});

gulp.task('scripts', function() {
  return buildScripts('./src', 'www', options.mode);
});

gulp.task('watch-scripts', function() {
  return watchScripts('./src', 'www', options.mode);
});

var tarifaRunning = false;
function handleTarifa() {
  if (tarifaRunning) { return; }
  tarifaRunning = true;
  var exec = require('child_process').exec;
  exec('tarifa build browser', { cwd: '../'}, function(error, stdout) {
    tarifaRunning = false;
    if (error) {
      handleError(error);
      return;
    }
    gutil.log(stdout);
  });
  gutil.log('Waiting for tarifa...');
}

// watch files for changes
gulp.task('launch-watch', function() {
  gulp.watch(paths.styles, ['styl']);
  gulp.watch(['src/index.html', 'env.json'], ['html']);
});

gulp.task('default', ['html', 'styl', 'scripts']);
gulp.task('watch', ['html', 'styl', 'watch-scripts', 'launch-watch']);

module.exports = {
  buildHtml: buildHtml,
  buildStyl: buildStyl,
  buildScripts: buildScripts,
  watchScripts: watchScripts,
  watchLaunch: watchLaunch  
};
