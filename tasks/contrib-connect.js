module.exports = function(grunt) {
  grunt.config('connect', {
    server: {
      options: {
        port: 9001,
        base: 'build',
        livereload: true
      }
    }
  });
};