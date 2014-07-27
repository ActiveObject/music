module.exports = function(grunt) {
  grunt.config('nodewebkit', {
    options: {
      build_dir: './nw',
      mac: true,
      win: true,
      linux32: true,
      linux64: true,
      zip: true
    },

    src: ['build/**/*']
  });
};