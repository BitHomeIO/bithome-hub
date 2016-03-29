/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 *
 * ---------------------------------------------------------------
 *
 * Watch for changes on
 * - files in the `assets` folder
 * - the `tasks/pipeline.js` file
 * and re-run the appropriate tasks.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-watch
 *
 */
module.exports = function(grunt) {

	grunt.config.set('watch', {
		assets: {

			// Assets to watch:
			files: ['assets/**/*', 'tasks/pipeline.js', '!**/node_modules/**', 'app/**/*.scss'],

			// When assets are changed:
			tasks: ['syncAssets' , 'linkAssets']
		},
		typescript: {

			// Assets to watch:
			files: ['app/**/*.ts'],

			// When assets are changed:
			tasks: ['compileTs']
		},
		copy: {

      // Assets to watch:
      files: ['app/**/*.ts', 'app/**/*.html'],

      // When assets are changed:
      tasks: ['copy:dev']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
};
