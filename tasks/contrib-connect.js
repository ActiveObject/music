module.exports = function(grunt) {
  grunt.config('connect', {
    server: {
      options: {
        port: 5003,
        base: 'build',
        livereload: true
      }
    }
  });
};