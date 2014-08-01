module.exports = function(grunt) {
  grunt.config('watchify', {
    options: {
      detectGlobals: true,
      insertGlobals: false,
      ignoreMissing: false,
      debug: true
    },

    js: {
      src: './src/**/*.js',
      dest: 'build/app.js'
    }
  });
};