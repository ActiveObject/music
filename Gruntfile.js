module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    nodewebkit: 'grunt-node-webkit-builder'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    publicDir: '_public'
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('build-dev', [
    'clean:build', 'clean:public', 'copy:assets', 'copy:dev',
    'svgstore', 'embed-icons', 'jshint:dev', 'clean:build'
  ]);

  grunt.registerTask('build', [
    'clean:build', 'clean:public', 'copy:assets', 'copy:dist',
    'svgstore', 'embed-icons', 'jshint:prod', 'clean:build'
  ]);
};