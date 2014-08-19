module.exports = function(grunt) {
  grunt.config('watch', {
    lint: {
      files: ['src/**/*.js'],
      tasks: ['jshint:dev']
    },

    app: {
      options: {
        livereload: true
      },
      files: ['src/**/*.js'],
    },

    assets: {
      options: {
        livereload: true
      },
      files: ['src/assets/**/*'],
      tasks: ['copy:build']
    },

    css: {
      options: {
        livereload: true
      },
      files: 'src/styles/**/*.styl',
      tasks: ['stylus']
    },

    icons: {
      options: {
        livereload: true
      },
      files: 'src/icons/**/*.svg',
      tasks: ['svgstore', 'embed-icons']
    }
  });
};