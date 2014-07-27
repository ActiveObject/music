var fs = require('fs'),
    path = require('path');

module.exports = function(grunt) {
  grunt.task.registerTask('linkapp', 'Make a symbolic link to src in node_modules', function() {
    var p = path.resolve(__dirname, '../node_modules/app');

    if (!fs.existsSync(p)) {
      grunt.log.write('Create symlink ' + path.resolve(__dirname, '../node_modules/app'));
      return fs.symlinkSync(path.resolve(__dirname, '../src'), path.resolve(__dirname, '../node_modules/app'));
    }
  });
};