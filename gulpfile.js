'use strict'

var gulp = require('gulp')
var browserify = require('browserify')
var watchify = require('watchify')
var nodemon = require('nodemon')
var livereload = require('gulp-livereload')
var less = require('gulp-less')
var rm = require('rimraf')
var source = require('vinyl-source-stream')

gulp.task('less', function() {
  return gulp.src('styles/main.less')
    .pipe(less())
    .pipe(gulp.dest('dist/styles'))
})

gulp.task('react', function() {
  return browserify('./client.js')
    .transform('reactify')
    .bundle()
    .pipe(source('./client.js'))
    .pipe(gulp.dest('dist/scripts'))
})

gulp.task('build', ['less', 'react'])

gulp.task('clean', function(done) {
  rm('./dist', done)
})

gulp.task('watch', ['less'], function() {
  var bundler = watchify(browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    entries: './client.js'
  }), watchify.args)

  livereload.listen()

  bundler.transform('reactify')
  bundler.on('update', reBundle)

  gulp.watch('views/*.html').on('change', livereload.reload)
  gulp.watch('styles/**/*.less', ['less'])
  gulp.watch('dist/styles/*.css', livereload.changed)

  nodemon({
    script: 'run.js',
    'ext': 'js jsx',
    watch: ['react-app.js', 'app.js', 'index.js', 'dist/scripts/client.js'],
    stdout: false
  }).on('readable', function() {
    this.stdout.on('data', function(data) {
      if(/^listening/.test(data)) {
        livereload.reload()
      }
      process.stdout.write(data)
    })
    this.stderr.pipe(process.stderr)
  }).on('restart', function() {
    console.log('restarting')
  })

  function reBundle() {
    return bundler
      .bundle()
      .on('error', function(err) {
        console.log(err.message)
        this.emit('end')
      })
      .pipe(source('./client.js'))
      .pipe(gulp.dest('dist/scripts'));
  }

  return reBundle()
})
