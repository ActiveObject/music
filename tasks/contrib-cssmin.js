module.exports = function(grunt) {
  grunt.config('cssmin', {
    options: {
      report: 'gzip'
    },

    minify: {
      src: ['build/app.css'],
      dest: 'dist/app.css'
    }
  });
};