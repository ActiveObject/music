module.exports = function(grunt) {
  grunt.config('stylus', {
    options: {
      compress: false
    },

    compile: {
      files: {
        'build/app.css': 'src/styles/main.styl'
      }
    }
  });
};