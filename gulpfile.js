const path = require('path');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const minimist = require('minimist');
const browserify = require('browserify');
const babelify = require('babelify');
const stylus = require('gulp-stylus');
const rename = require('gulp-rename');
const gutil = require('gulp-util');
const watchify = require('watchify');
const uglify = require('gulp-uglify-es').default;
const preprocess = require('gulp-preprocess');
const autoprefixer = require('gulp-autoprefixer');

const SRC = 'src';
const DEST = 'www';

const minimistOptions = {
  string: ['env', 'mode', 'target'],
  default: {
    env: 'env.json',
    mode: 'dev',
    target: 'browser'
  }
};

const options = minimist(process.argv.slice(2), minimistOptions);

var paths = {
  styles: ['src/styl/reset.styl', 'src/styl/common.styl', 'src/styl/form.styl',
           'src/styl/overlay.styl', 'src/stl/overlap-popup.styl', 'src/styl/*.styl'
          ]
};

const browsers = ['and_chr >= 53', 'ios_saf >= 10'];

const babelSettings = {
  extensions: ['.js', '.jsx'],
  presets: [['es2015']]
};

var logErrorAndExit = function(error) {
  gutil.log(gutil.colors.red(error.message));
  process.exit(1);
};

gulp.task('html', () => {
  const context = require('./' + options.env);
  context.TARGET = options.target;
  context.MODE = options.mode;

  return gulp.src(path.join(SRC, 'index.html'))
    .pipe(preprocess({ context: context }))
    .on('error', logErrorAndExit)
    .pipe(gulp.dest(DEST));
});

gulp.task('styl', () => {
  return gulp.src(SRC + '/styl/index.styl')
    .pipe(stylus({
      compress: options.mode === 'release'
    }))
    .pipe(autoprefixer({ browsers }))
    .pipe(rename('app.css'))
    .on('error', logErrorAndExit)
    .pipe(gulp.dest(DEST + '/css/compiled/'));
});

gulp.task('scripts', () => {
  return browserify(SRC + '/main.js', { debug: true, extensions: ['.jsx'] })
    .transform(babelify, babelSettings)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    // .pipe(uglify({ safari10: true }))
    .on('error', logErrorAndExit)
    .pipe(gulp.dest(DEST));
});

gulp.task('watch-scripts', () => {
  const opts = watchify.args;
  opts.debug = true;
  opts.extensions = ['.jsx'];

  const bundleStream = watchify(
    browserify(SRC + '/main.js', opts)
      .transform(babelify, babelSettings)
  );

  function rebundle() {
    return bundleStream
      .bundle()
      .on('error', error => gutil.log(gutil.colors.red(error.message)))
      .pipe(source('app.js'))
      .pipe(gulp.dest('./www'));
  }

  bundleStream.on('update', rebundle);
  bundleStream.on('log', gutil.log);

  return rebundle();  
});

gulp.task('launch-watch', () => {
  gulp.watch(paths.styles, ['styl']);
  gulp.watch(['src/index.html', 'env.json'], ['html']);
});

gulp.task('default', ['html', 'styl', 'scripts']);
gulp.task('watch', ['html', 'styl', 'watch-scripts', 'launch-watch']);
