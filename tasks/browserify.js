module.exports = function(grunt) {
  grunt.config('browserify', {
    app: {
      files: {
        'build/app.js': ['src/main.js']
      }
    }
  });
};