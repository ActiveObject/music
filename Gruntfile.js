module.exports = function(grunt) {
  // require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    nodewebkit: 'grunt-node-webkit-builder'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('dist', [
    'clean:dist', 'clean:build', 'copy:assets', 'jshint:prod',
    'stylus', 'svgstore', 'embed-icons', 'browserify',
    'cssmin', 'uglify', 'copy:dist', 'nodewebkit'
  ]);

  grunt.registerTask('default', [
    'clean:build', 'copy:assets', 'copy:dev', 'svgstore', 'embed-icons',
    'jshint:dev', 'stylus', 'connect', 'watchify', 'watch'
  ]);
};