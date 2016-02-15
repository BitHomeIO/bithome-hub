module.exports = function (grunt) {
	grunt.registerTask('build', [
		'compileAssets',
		'compileTs',
		'linkAssetsBuild',
		'clean:build',
		'copy:build'
	]);
};
