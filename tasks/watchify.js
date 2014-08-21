module.exports = function(grunt) {
  grunt.config('watchify', {
    options: {
      detectGlobals: true,
      insertGlobals: false,
      ignoreMissing: false,
      debug: true,
      callback: function (b) {
        b.require('react');
        return b;
      }
    },

    js: {
      src: './src/**/*.js',
      dest: 'build/app.js'
    }
  });
};