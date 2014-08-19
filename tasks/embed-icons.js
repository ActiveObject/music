module.exports = function (grunt) {
  grunt.task.registerTask('embed-icons', 'Embed svg sprite into index.html', function () {
    var index = grunt.file.read('src/templates/index.html');
    var sprite = grunt.file.read('build/svg-defs.svg');
    var result = grunt.template.process(index, {
      data: { iconsSvg: sprite }
    });

    grunt.file.write('build/index.html', result);
  });
};