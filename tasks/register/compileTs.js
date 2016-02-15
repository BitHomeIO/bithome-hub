module.exports = function (grunt) {
	grunt.registerTask('compileTs', [
		'tslint',
		'ts'
	]);
};
