module.exports = function(grunt) {
  grunt.config('uglify', {
    compile: {
      options: {
          compress: true,
          verbose: true,
          report: 'gzip'
      },
      files: [{
          src: 'build/app.js',
          dest: 'dist/app.js'
      }]
    }
  });
};