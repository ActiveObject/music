module.exports = function(grunt) {
  grunt.config('copy', {
    assets: {
      files: [{
        expand: true,
        src: '**/*',
        dest: 'build/',
        cwd: 'src/assets'
      }]
    },

    dev: {
      files: [
        { src: 'vendor/soundmanager2.js', dest: 'build/soundmanager2.js' }
      ]
    },

    dist: {
      files: [
        { src: 'build/app.js', dest: 'dist/app.js' },
        { src: 'build/app.css', dest: 'dist/app.css' },
        { src: 'build/index.html', dest: 'dist/index.html' },
        { src: 'build/package.json', dest: 'dist/package.json' },
        { src: 'vendor/soundmanager2-nodebug-jsmin.js', dest: 'dist/soundmanager2.js' },
        { src: 'build/swf/**/*', dest: 'dist/' }
      ]
    }
  });
};