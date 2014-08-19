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

    dist: {
      files: [
        { src: 'build/app.js', dest: 'dist/app.js' },
        { src: 'build/app.css', dest: 'dist/app.css' },
        { src: 'build/index.html', dest: 'dist/index.html' },
        { src: 'build/package.json', dest: 'dist/package.json' }
      ]
    }
  });
};