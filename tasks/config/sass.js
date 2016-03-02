/**
 * Compiles SCSS files into CSS.
 *
 * ---------------------------------------------------------------
 */
module.exports = function (grunt) {

  grunt.config.set('sass', {
    dev: {
      files: [{
        expand: true,
        cwd: 'assets/styles/',
        src: ['importer.scss'],
        dest: '.tmp/public/styles/',
        ext: '.css'
      }, {
        expand: true,
        cwd: 'app',
        src: ['**/*.scss'],
        dest: '.tmp/public/app',
        ext: '.css'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-sass');
};
