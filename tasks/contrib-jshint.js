module.exports = function(grunt) {
  grunt.config('jshint', {
    options: {
      reporter: require('jshint-stylish'),
      curly: true,
      eqnull: true,
      eqeqeq: true,
      undef: true,
      browser: true,
      proto: true,
      node: true,
      predef: [ '-Promise' ]
    },

    dev: {
      options: {
        force: true,
        devel: true
      },

      files: {
        src: ['src/**/*.js']
      }
    },

    prod: {
      files: {
        src: ['src/**/*.js']
      }
    }
  });
};