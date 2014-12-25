var fs = require('fs'),
    path = require('path');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    publicDir: '_public',
    svgstore: {
      options: {
        prefix: 'shape-',
        formatting: {
          indent_size: 2
        },
        svg: {
          style: 'display:none'
        }
      },

      default: {
        files: {
          'build/svg-defs.svg': ['src/icons/*.svg']
        }
      }
    }
  });

  grunt.task.registerTask('embed-icons', 'Embed svg sprite into index.html', function () {
    var publicDir = grunt.config('publicDir');
    var index = grunt.file.read('src/templates/index.html');
    var sprite = grunt.file.read('build/svg-defs.svg');
    var result = grunt.template.process(index, {
      data: { iconsSvg: sprite }
    });

    grunt.file.write(path.join(publicDir, 'index.html'), result);
  });

  grunt.task.registerTask('linkapp', 'Make a symbolic link to src in node_modules', function() {
    var p = path.resolve(__dirname, '../node_modules/app');

    if (!fs.existsSync(p)) {
      grunt.log.write('Create symlink ' + path.resolve(__dirname, '../node_modules/app'));
      return fs.symlinkSync(path.resolve(__dirname, '../src'), path.resolve(__dirname, '../node_modules/app'));
    }
  });

  grunt.loadNpmTasks('grunt-svgstore');
  grunt.registerTask('build', ['svgstore', 'embed-icons']);
};