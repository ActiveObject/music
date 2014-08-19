module.exports = function (grunt) {
  grunt.config('svgstore', {
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
  });
};