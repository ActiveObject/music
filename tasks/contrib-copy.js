module.exports = function(grunt) {
  grunt.config('copy', {
    assets: {
      files: [{
        expand: true,
        src: '**/*',
        dest: '<%= publicDir %>',
        cwd: 'src/assets'
      }]
    },

    dev: {
      files: [
        { src: 'vendor/soundmanager2.js', dest: '<%= publicDir %>/soundmanager2.js' }
      ]
    },

    dist: {
      files: [
        { src: 'vendor/soundmanager2-nodebug-jsmin.js', dest: '<%= publicDir %>/soundmanager2.js' }
      ]
    }
  });
};