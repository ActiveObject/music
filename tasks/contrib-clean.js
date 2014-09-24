module.exports = function(grunt) {
  grunt.config('clean', {
    public: ['<%= publicDir %>'],
    build: ['build']
  });
};