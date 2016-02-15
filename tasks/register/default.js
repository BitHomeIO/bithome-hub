module.exports = function (grunt) {
	grunt.registerTask('default', ['compileAssets', 'compileTs', 'linkAssets',  'watch']);
};
