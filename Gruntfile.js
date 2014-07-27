module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    nodewebkit: 'grunt-node-webkit-builder'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('dist', [
    'clean:dist', 'copy:dist', 'jshint:prod', 'stylus',
    'browserify', 'cssmin', 'uglify', 'nodewebkit'
  ]);

  grunt.registerTask('default', [
    'clean:build', 'copy:build', 'jshint:dev', 'stylus',
    'watchify', 'connect', 'watch'
  ]);
};