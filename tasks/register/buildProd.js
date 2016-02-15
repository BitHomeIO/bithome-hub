module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
		'compileAssets',
		'compileTs',
		'concat',
		'uglify',
		'cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};
