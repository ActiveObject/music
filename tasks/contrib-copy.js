module.exports = function(grunt) {
  grunt.config('copy', {
    build: {
      files: [{
        expand: true,
        src: '**/*',
        dest: 'build/',
        cwd: 'src/assets'
      }]
    },

    dist: {
      files: [{
        expand: true,
        src: '**/*',
        dest: 'dist/',
        cwd: 'src/assets'
      }]
    }
  });
};