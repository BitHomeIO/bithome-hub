/**
 * Perform linting on the Typescript files
 *
 * ---------------------------------------------------------------
 *
 */
module.exports = function(grunt) {

	grunt.config.set('tslint', {
		options: {
			// can be a configuration object or a filepath to tslint.json
			configuration: "tslint.json"
		},
		files: {
			src: [ "app/**/*.ts" ]
    }
	});

	grunt.loadNpmTasks('grunt-tslint');
};
